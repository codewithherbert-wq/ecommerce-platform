import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";
import { orders } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; tracking?: string }>;
}) {
  const { order: orderId, tracking } = await searchParams;

  let trackingCode = tracking;
  if (!trackingCode && orderId) {
    const row = await db
      .select({ trackingCode: orders.trackingCode })
      .from(orders)
      .where(eq(orders.id, orderId))
      .limit(1);
    trackingCode = row[0]?.trackingCode;
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 sm:px-6">
      <div className="rounded-lg border border-green-200 bg-green-50 p-10 text-center dark:border-green-900 dark:bg-green-900/10">
        <CheckCircle2 className="mx-auto h-14 w-14 text-green-600" />
        <h1 className="mt-4 text-2xl font-bold">Order placed!</h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Thanks for your purchase. We&apos;ve emailed you the details.
        </p>
        {trackingCode && (
          <>
            <p className="mt-6 text-sm font-medium">Your tracking code:</p>
            <p className="mt-1 text-2xl font-mono font-bold tracking-widest">
              {trackingCode}
            </p>
            <Link
              href={`/track/${trackingCode}`}
              className="mt-6 inline-block rounded-md bg-[var(--shop-primary)] px-5 py-2.5 text-sm font-medium text-white"
            >
              Track your order
            </Link>
          </>
        )}
        <p className="mt-8 flex flex-col items-center gap-2 text-sm sm:flex-row sm:justify-center sm:gap-6">
          <Link href="/orders" className="underline">
            View all my orders
          </Link>
          <Link href="/products" className="underline">
            Continue shopping
          </Link>
        </p>
      </div>
    </div>
  );
}
