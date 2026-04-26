import Link from "next/link";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { desc } from "drizzle-orm";
import { formatMoney, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, type OrderStatus } from "@/lib/tracking";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
  return (
    <div>
      <h1 className="text-2xl font-bold">Orders</h1>

      <div className="mt-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-800">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3">Tracking</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Placed</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-800 dark:bg-gray-900">
            {rows.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-gray-500">
                  No orders yet.
                </td>
              </tr>
            ) : (
              rows.map((o) => (
                <tr key={o.id}>
                  <td className="whitespace-nowrap px-4 py-3 font-mono text-xs">
                    {o.trackingCode}
                  </td>
                  <td className="px-4 py-3">
                    <div>{o.customerName}</div>
                    <div className="text-xs text-gray-500">
                      {o.customerEmail}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">
                    {formatMoney(o.totalCents, o.currency)}
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        o.status === "delivered"
                          ? "success"
                          : o.status === "cancelled"
                          ? "danger"
                          : "info"
                      }
                    >
                      {STATUS_LABELS[o.status as OrderStatus] ?? o.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant={
                        o.paymentStatus === "paid"
                          ? "success"
                          : o.paymentStatus === "failed"
                          ? "danger"
                          : "muted"
                      }
                    >
                      {o.paymentMethod} · {o.paymentStatus}
                    </Badge>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-xs text-gray-500">
                    {formatDate(o.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/orders/${o.id}`}
                      className="text-sm font-medium text-[var(--shop-accent)] hover:underline"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
