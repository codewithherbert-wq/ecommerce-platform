import { NextResponse } from "next/server";
import { verifyCoinbaseSignature } from "@/lib/coinbase";
import { db } from "@/lib/db";
import { orders, trackingEvents, products, orderItems } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";

export async function POST(req: Request) {
  const raw = await req.text();
  const sig = req.headers.get("x-cc-webhook-signature");
  if (!verifyCoinbaseSignature(raw, sig)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }
  const payload = JSON.parse(raw) as {
    event: {
      type: string;
      data: { metadata?: { order_id?: string } };
    };
  };
  const type = payload.event.type;
  const orderId = payload.event.data.metadata?.order_id;
  if (!orderId) return NextResponse.json({ ok: true });

  if (type === "charge:confirmed" || type === "charge:resolved") {
    await db
      .update(orders)
      .set({ paymentStatus: "paid", status: "paid", updatedAt: new Date() })
      .where(eq(orders.id, orderId));
    await db.insert(trackingEvents).values({
      orderId,
      status: "paid",
      message: "Crypto payment confirmed on-chain.",
    });

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
  } else if (type === "charge:failed") {
    await db
      .update(orders)
      .set({ paymentStatus: "failed", updatedAt: new Date() })
      .where(eq(orders.id, orderId));
    await db.insert(trackingEvents).values({
      orderId,
      status: "failed",
      message: "Crypto payment failed or expired.",
    });
  }

  return NextResponse.json({ ok: true });
}
