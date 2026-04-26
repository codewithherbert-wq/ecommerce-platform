import { db } from "@/lib/db";
import { orders, products } from "@/lib/db/schema";
import { count, eq, sum } from "drizzle-orm";
import { formatMoney } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [totalProducts] = await db.select({ c: count() }).from(products);
  const [totalOrders] = await db.select({ c: count() }).from(orders);
  const [paidRev] = await db
    .select({ s: sum(orders.totalCents) })
    .from(orders)
    .where(eq(orders.paymentStatus, "paid"));
  const [pending] = await db
    .select({ c: count() })
    .from(orders)
    .where(eq(orders.status, "pending"));

  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total products" value={String(totalProducts.c)} href="/admin/products" />
        <Stat label="Total orders" value={String(totalOrders.c)} href="/admin/orders" />
        <Stat
          label="Paid revenue"
          value={formatMoney(Number(paidRev.s ?? 0))}
        />
        <Stat label="Pending orders" value={String(pending.c)} href="/admin/orders" />
      </div>

      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold">Quick actions</h2>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
          <li>
            Go to{" "}
            <Link href="/admin/settings" className="underline">
              Shop settings
            </Link>{" "}
            to change the store name, theme, hero headline, and logo — you can
            re-brand the store as a spare-parts shop, shoe store, etc.
          </li>
          <li>
            Add products under{" "}
            <Link href="/admin/products" className="underline">
              Products
            </Link>
            .
          </li>
          <li>
            Add at least one{" "}
            <Link href="/admin/agencies" className="underline">
              delivery agency
            </Link>{" "}
            so customers can check out.
          </li>
        </ul>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: string;
  href?: string;
}) {
  const inner = (
    <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
      <div className="text-xs uppercase text-gray-500">{label}</div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}
