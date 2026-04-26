import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { orders, orderItems, trackingEvents } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ code: string }> }
) {
  const { code } = await ctx.params;
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.trackingCode, code))
    .limit(1);
  if (!order) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const [items, events] = await Promise.all([
    db.select().from(orderItems).where(eq(orderItems.orderId, order.id)),
    db
      .select()
      .from(trackingEvents)
      .where(eq(trackingEvents.orderId, order.id))
      .orderBy(asc(trackingEvents.createdAt)),
  ]);
  return NextResponse.json({ order, items, events });
}
