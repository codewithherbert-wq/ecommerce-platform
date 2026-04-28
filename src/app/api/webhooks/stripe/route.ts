import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { orders, trackingEvents, products, orderItems } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const whSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !whSecret) {
    return NextResponse.json(
      { error: "Missing signature or webhook secret" },
      { status: 400 }
    );
  }
  const raw = await req.text();
  let event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, whSecret);
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Signature verification failed";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      metadata?: { order_id?: string };
    };
    const orderId = session.metadata?.order_id;
    if (orderId) {
      await db
        .update(orders)
        .set({
          paymentStatus: "paid",
          status: "paid",
          updatedAt: new Date(),
        })
        .where(eq(orders.id, orderId));

      await db.insert(trackingEvents).values({
        orderId,
        status: "paid",
        message: "Payment received. Order confirmed.",
      });

      // Atomic stock decrement.
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, orderId));
      for (const item of items) {
        if (!item.productId) continue;
        await db
          .update(products)
          .set({
            stock: sql`GREATEST(0, ${products.stock} - ${item.quantity})`,
          })
          .where(eq(products.id, item.productId));
      }
    }
  }

  return NextResponse.json({ received: true });
}
