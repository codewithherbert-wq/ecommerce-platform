import { db } from "@/lib/db";
import {
  orders,
  orderItems,
  products,
  users,
} from "@/lib/db/schema";
import { count, eq, sum, sql, desc } from "drizzle-orm";
import { formatMoney } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const [
    totalProducts,
    totalOrdersRow,
    paidRev,
    pendingRev,
    statusBreakdown,
    revenueByDay,
    topProducts,
    recentOrders,
    totalCustomers,
  ] = await Promise.all([
    db.select({ c: count() }).from(products).then((r) => Number(r[0]?.c ?? 0)),
    db.select({ c: count() }).from(orders).then((r) => Number(r[0]?.c ?? 0)),
    db
      .select({ s: sum(orders.totalCents) })
      .from(orders)
      .where(eq(orders.paymentStatus, "paid"))
      .then((r) => Number(r[0]?.s ?? 0)),
    db
      .select({ s: sum(orders.totalCents) })
      .from(orders)
      .where(eq(orders.paymentStatus, "pending"))
      .then((r) => Number(r[0]?.s ?? 0)),
    db
      .select({
        status: orders.status,
        c: count(),
        revenue: sum(orders.totalCents),
      })
      .from(orders)
      .groupBy(orders.status),
    db
      .select({
        day: sql<string>`to_char(${orders.createdAt}, 'YYYY-MM-DD')`,
        revenue: sum(orders.totalCents),
        orderCount: count(),
      })
      .from(orders)
      .where(sql`${orders.createdAt} >= now() - interval '30 days'`)
      .groupBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD')`)
      .orderBy(sql`to_char(${orders.createdAt}, 'YYYY-MM-DD')`),
    db
      .select({
        productId: orderItems.productId,
        name: orderItems.name,
        imageUrl: orderItems.imageUrl,
        unitsSold: sum(orderItems.quantity),
        revenue: sum(
          sql<number>`${orderItems.unitPriceCents} * ${orderItems.quantity}`
        ),
      })
      .from(orderItems)
      .groupBy(orderItems.productId, orderItems.name, orderItems.imageUrl)
      .orderBy(desc(sum(orderItems.quantity)))
      .limit(5),
    db
      .select({
        id: orders.id,
        trackingCode: orders.trackingCode,
        customerName: orders.customerName,
        totalCents: orders.totalCents,
        currency: orders.currency,
        status: orders.status,
        paymentStatus: orders.paymentStatus,
        createdAt: orders.createdAt,
      })
      .from(orders)
      .orderBy(desc(orders.createdAt))
      .limit(8),
    db.select({ c: count() }).from(users).then((r) => Number(r[0]?.c ?? 0)),
  ]);

  const totalOrders = totalOrdersRow;
  const aov =
    totalOrders > 0 ? Math.round(paidRev / Math.max(totalOrders, 1)) : 0;

  // Build a 30-day window so empty days appear in chart
  const today = new Date();
  const days: { day: string; revenue: number; orderCount: number }[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    const found = revenueByDay.find((r) => r.day === key);
    days.push({
      day: key,
      revenue: Number(found?.revenue ?? 0),
      orderCount: Number(found?.orderCount ?? 0),
    });
  }
  const maxRev = Math.max(1, ...days.map((d) => d.revenue));

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <Link
          href="/admin"
          className="text-sm text-[var(--shop-accent)] hover:underline"
        >
          ← Back to dashboard
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Stat label="Paid revenue" value={formatMoney(paidRev)} />
        <Stat label="Pending revenue" value={formatMoney(pendingRev)} />
        <Stat label="Avg. order value" value={formatMoney(aov)} />
        <Stat label="Total orders" value={String(totalOrders)} />
        <Stat label="Total products" value={String(totalProducts)} />
        <Stat label="Total customers" value={String(totalCustomers)} />
      </div>

      <Card title="Revenue — last 30 days">
        {paidRev === 0 && pendingRev === 0 ? (
          <p className="py-8 text-center text-sm text-gray-500">
            No order data yet. Once you take orders they&apos;ll appear here.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex h-48 min-w-[600px] items-end gap-1">
              {days.map((d) => {
                const h = (d.revenue / maxRev) * 100;
                return (
                  <div
                    key={d.day}
                    className="flex flex-1 flex-col items-center gap-1"
                    title={`${d.day}: ${formatMoney(d.revenue)} (${
                      d.orderCount
                    } order${d.orderCount === 1 ? "" : "s"})`}
                  >
                    <div className="flex h-full w-full items-end">
                      <div
                        className="w-full rounded-t-sm bg-[var(--shop-accent)] transition-all"
                        style={{ height: `${Math.max(h, d.revenue ? 2 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>{days[0]?.day}</span>
              <span>{days[days.length - 1]?.day}</span>
            </div>
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Order status breakdown">
          {statusBreakdown.length === 0 ? (
            <p className="py-4 text-sm text-gray-500">No orders yet.</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {statusBreakdown.map((s) => {
                const pct =
                  totalOrders > 0
                    ? Math.round((Number(s.c) / totalOrders) * 100)
                    : 0;
                return (
                  <li key={s.status}>
                    <div className="flex items-center justify-between">
                      <span className="capitalize">
                        {s.status.replaceAll("_", " ")}
                      </span>
                      <span className="text-gray-500">
                        {String(s.c)} · {formatMoney(Number(s.revenue ?? 0))}
                      </span>
                    </div>
                    <div className="mt-1 h-2 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className="h-full bg-[var(--shop-primary)]"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </Card>

        <Card title="Top products (by units sold)">
          {topProducts.length === 0 ? (
            <p className="py-4 text-sm text-gray-500">
              No sales recorded yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {topProducts.map((p) => (
                <li
                  key={`${p.productId ?? p.name}`}
                  className="flex items-center gap-3"
                >
                  {p.imageUrl ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={p.imageUrl}
                      alt=""
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-md bg-gray-100 dark:bg-gray-800" />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      {p.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      {String(p.unitsSold)} sold ·{" "}
                      {formatMoney(Number(p.revenue ?? 0))}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>

      <Card title="Recent orders">
        {recentOrders.length === 0 ? (
          <p className="py-4 text-sm text-gray-500">No orders yet.</p>
        ) : (
          <div className="-mx-4 overflow-x-auto sm:mx-0">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="text-left text-xs uppercase text-gray-500">
                  <th className="px-4 py-2">Tracking</th>
                  <th className="px-4 py-2">Customer</th>
                  <th className="px-4 py-2">Status</th>
                  <th className="px-4 py-2">Payment</th>
                  <th className="px-4 py-2 text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr
                    key={o.id}
                    className="border-t border-gray-100 dark:border-gray-800"
                  >
                    <td className="px-4 py-2 font-mono text-xs">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="hover:underline"
                      >
                        {o.trackingCode}
                      </Link>
                    </td>
                    <td className="px-4 py-2 truncate">{o.customerName}</td>
                    <td className="px-4 py-2 capitalize">
                      {o.status.replaceAll("_", " ")}
                    </td>
                    <td className="px-4 py-2 capitalize">{o.paymentStatus}</td>
                    <td className="px-4 py-2 text-right">
                      {formatMoney(o.totalCents)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:p-5">
      <div className="text-xs uppercase text-gray-500">{label}</div>
      <div className="mt-1 text-xl font-bold sm:text-2xl">{value}</div>
    </div>
  );
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-800 dark:bg-gray-900 sm:p-6">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
    </section>
  );
}
