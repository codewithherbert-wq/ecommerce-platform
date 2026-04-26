import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { orders, orderItems, trackingEvents } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { OrderManager } from "./OrderManager";

export const dynamic = "force-dynamic";

export default async function AdminOrderDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, id))
    .limit(1);
  if (!order) notFound();
  const [items, events] = await Promise.all([
    db.select().from(orderItems).where(eq(orderItems.orderId, order.id)),
    db
      .select()
      .from(trackingEvents)
      .where(eq(trackingEvents.orderId, order.id))
      .orderBy(asc(trackingEvents.createdAt)),
  ]);
  return <OrderManager order={order} items={items} events={events} />;
}
