import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import {
  orders,
  orderItems,
  deliveryAgencies,
  products,
  trackingEvents,
} from "@/lib/db/schema";
import { eq, inArray } from "drizzle-orm";
import { requireUser } from "@/lib/admin";
import { generateTrackingCode } from "@/lib/tracking";

const schema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string().uuid(),
        name: z.string(),
        imageUrl: z.string().nullable(),
        unitPriceCents: z.number().int().nonnegative(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
  deliveryAgencyId: z.string().uuid(),
  customerName: z.string().min(1),
  customerEmail: z.string().email(),
  customerPhone: z.string().optional(),
  line1: z.string().min(1),
  line2: z.string().optional(),
  city: z.string().min(1),
  state: z.string().optional(),
  postalCode: z.string().min(1),
  country: z.string().min(2).max(2),
});

export async function POST(req: Request) {
  const gate = await requireUser();
  if (!gate.ok)
    return NextResponse.json({ error: gate.error }, { status: gate.status });

  const body = await req.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }
  const input = parsed.data;

  const productIds = input.items.map((i) => i.productId);
  const dbProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, productIds));
  for (const item of input.items) {
    const p = dbProducts.find((x) => x.id === item.productId);
    if (!p || !p.active) {
      return NextResponse.json(
        { error: `Product unavailable: ${item.name}` },
        { status: 400 }
      );
    }
    if (p.priceCents !== item.unitPriceCents) {
      return NextResponse.json(
        { error: `Price changed for ${p.name}. Please refresh your cart.` },
        { status: 400 }
      );
    }
    if (p.stock < item.quantity) {
      return NextResponse.json(
        { error: `Insufficient stock for ${p.name}` },
        { status: 400 }
      );
    }
  }

  const [agency] = await db
    .select()
    .from(deliveryAgencies)
    .where(eq(deliveryAgencies.id, input.deliveryAgencyId))
    .limit(1);
  if (!agency) {
    return NextResponse.json(
      { error: "Invalid delivery agency" },
      { status: 400 }
    );
  }

  const subtotal = input.items.reduce(
    (s, i) => s + i.unitPriceCents * i.quantity,
    0
  );
  const shipping = agency.priceCents;
  const total = subtotal + shipping;

  const trackingCode = generateTrackingCode();

  const [order] = await db
    .insert(orders)
    .values({
      userId: gate.session.user.id,
      trackingCode,
      status: "processing",
      paymentStatus: "pending",
      paymentMethod: "cod",
      subtotalCents: subtotal,
      shippingCents: shipping,
      totalCents: total,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      shippingAddress: {
        line1: input.line1,
        line2: input.line2,
        city: input.city,
        state: input.state,
        postalCode: input.postalCode,
        country: input.country,
      },
      deliveryAgencyId: agency.id,
      deliveryAgencyName: agency.name,
    })
    .returning();

  await db.insert(orderItems).values(
    input.items.map((i) => ({
      orderId: order.id,
      productId: i.productId,
      name: i.name,
      imageUrl: i.imageUrl,
      unitPriceCents: i.unitPriceCents,
      quantity: i.quantity,
    }))
  );

  await db.insert(trackingEvents).values({
    orderId: order.id,
    status: "processing",
    message: "Order placed — awaiting payment on delivery.",
    location: [input.city, input.country].filter(Boolean).join(", ") || null,
  });

  // Decrement stock so subsequent customers see accurate availability.
  for (const item of input.items) {
    const p = dbProducts.find((x) => x.id === item.productId);
    if (!p) continue;
    await db
      .update(products)
      .set({ stock: Math.max(0, p.stock - item.quantity) })
      .where(eq(products.id, p.id));
  }

  // Send the user straight to their tracking page.
  return NextResponse.json({
    url: `/track/${trackingCode}`,
    orderId: order.id,
    trackingCode,
  });
}
