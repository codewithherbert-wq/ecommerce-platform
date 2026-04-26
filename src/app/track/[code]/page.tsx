import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { orders, orderItems, trackingEvents } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { formatMoney, formatDate } from "@/lib/utils";
import { STATUS_LABELS, statusProgress, type OrderStatus } from "@/lib/tracking";
import { Badge } from "@/components/ui/badge";
import { TrackingMap } from "@/components/TrackingMap";

export const dynamic = "force-dynamic";

export default async function TrackOrder({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.trackingCode, code.toUpperCase()))
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

  const progress = statusProgress(order.status as OrderStatus);

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Order tracking</h1>
          <p className="mt-1 font-mono text-sm text-gray-500">
            {order.trackingCode}
          </p>
        </div>
        <Badge variant={order.status === "delivered" ? "success" : "info"}>
          {STATUS_LABELS[order.status as OrderStatus] ?? order.status}
        </Badge>
      </div>

      {/* Progress bar */}
      <div className="mt-8">
        <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
          <div
            className="h-full bg-[var(--shop-accent)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-3 grid grid-cols-6 gap-1 text-[10px] text-gray-500 sm:text-xs">
          {["pending", "paid", "processing", "shipped", "out_for_delivery", "delivered"].map(
            (s) => (
              <div key={s} className="text-center">
                {STATUS_LABELS[s as OrderStatus]}
              </div>
            )
          )}
        </div>
      </div>

      {/* Map */}
      <div className="mt-8 h-80 overflow-hidden rounded-lg border border-gray-200 dark:border-gray-800">
        <TrackingMap
          current={
            order.currentLat != null && order.currentLng != null
              ? { lat: order.currentLat, lng: order.currentLng }
              : null
          }
          destination={
            order.destinationLat != null && order.destinationLng != null
              ? { lat: order.destinationLat, lng: order.destinationLng }
              : null
          }
        />
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
        <section>
          <h2 className="text-lg font-semibold">Shipment events</h2>
          {events.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">
              No tracking events yet. We&apos;ll update you as your order moves.
            </p>
          ) : (
            <ol className="mt-4 space-y-4 border-l border-gray-200 pl-5 dark:border-gray-800">
              {events.map((e) => (
                <li key={e.id} className="relative">
                  <span className="absolute -left-[27px] mt-1.5 h-3 w-3 rounded-full bg-[var(--shop-accent)]" />
                  <div className="text-sm font-medium">
                    {STATUS_LABELS[e.status as OrderStatus] ?? e.status}
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(e.createdAt)}
                    {e.location ? ` · ${e.location}` : ""}
                  </div>
                  {e.message && (
                    <div className="mt-1 text-sm text-gray-700 dark:text-gray-300">
                      {e.message}
                    </div>
                  )}
                </li>
              ))}
            </ol>
          )}
        </section>

        <aside className="h-fit rounded-lg border border-gray-200 p-5 dark:border-gray-800">
          <h2 className="text-lg font-semibold">Order details</h2>
          <dl className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Placed</dt>
              <dd>{formatDate(order.createdAt)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Agency</dt>
              <dd>{order.deliveryAgencyName ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Payment</dt>
              <dd className="capitalize">
                {order.paymentMethod} · {order.paymentStatus}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Total</dt>
              <dd className="font-semibold">
                {formatMoney(order.totalCents, order.currency)}
              </dd>
            </div>
          </dl>
          <div className="mt-4 border-t border-gray-200 pt-4 text-sm dark:border-gray-800">
            <h3 className="font-semibold">Shipping to</h3>
            <address className="mt-1 not-italic text-gray-600 dark:text-gray-400">
              {order.customerName}
              <br />
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 && (
                <>
                  <br />
                  {order.shippingAddress.line2}
                </>
              )}
              <br />
              {order.shippingAddress.city}
              {order.shippingAddress.state
                ? `, ${order.shippingAddress.state}`
                : ""}{" "}
              {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </address>
          </div>
          <div className="mt-4 border-t border-gray-200 pt-4 dark:border-gray-800">
            <h3 className="text-sm font-semibold">Items</h3>
            <ul className="mt-2 space-y-2 text-sm">
              {items.map((i) => (
                <li key={i.id} className="flex justify-between gap-2">
                  <span className="line-clamp-1">
                    {i.name} × {i.quantity}
                  </span>
                  <span className="tabular-nums">
                    {formatMoney(i.unitPriceCents * i.quantity)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
