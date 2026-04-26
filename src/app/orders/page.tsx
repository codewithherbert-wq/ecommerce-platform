import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { formatMoney, formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABELS, type OrderStatus } from "@/lib/tracking";

export const dynamic = "force-dynamic";

export default async function MyOrders() {
  const session = await auth();
  if (!session?.user) redirect("/auth/signin?callbackUrl=/orders");
  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, session.user.id))
    .orderBy(desc(orders.createdAt));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">My orders</h1>
      {rows.length === 0 ? (
        <p className="mt-10 text-center text-sm text-gray-500">
          You haven&apos;t placed any orders yet.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-gray-200 rounded-lg border border-gray-200 bg-white dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900">
          {rows.map((o) => (
            <li key={o.id} className="flex items-center justify-between p-5">
              <div>
                <Link
                  href={`/track/${o.trackingCode}`}
                  className="font-mono text-sm hover:underline"
                >
                  {o.trackingCode}
                </Link>
                <div className="mt-0.5 text-xs text-gray-500">
                  {formatDate(o.createdAt)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-semibold">
                  {formatMoney(o.totalCents, o.currency)}
                </div>
                <Badge
                  variant={
                    o.status === "delivered"
                      ? "success"
                      : o.status === "cancelled"
                      ? "danger"
                      : "info"
                  }
                  className="mt-1"
                >
                  {STATUS_LABELS[o.status as OrderStatus] ?? o.status}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
