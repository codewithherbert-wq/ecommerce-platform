import Link from "next/link";
import { ArrowRight, ShieldCheck, Truck, CreditCard, Bitcoin } from "lucide-react";
import { getShopConfig } from "@/lib/shop";
import { db } from "@/lib/db";
import { products } from "@/lib/db/schema";
import type { Product } from "@/lib/db/schema";
import { desc, eq, and } from "drizzle-orm";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const config = await getShopConfig();
  let featured: Product[] = [];
  try {
    featured = await db
      .select()
      .from(products)
      .where(and(eq(products.active, true), eq(products.featured, true)))
      .orderBy(desc(products.createdAt))
      .limit(8);
    if (featured.length === 0) {
      featured = await db
        .select()
        .from(products)
        .where(eq(products.active, true))
        .orderBy(desc(products.createdAt))
        .limit(8);
    }
  } catch {
    featured = [];
  }

  return (
    <div>
      {/* Hero */}
      <section
        className="relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, var(--shop-primary), color-mix(in oklab, var(--shop-primary) 60%, var(--shop-accent)))`,
        }}
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:py-32">
          <div className="text-white">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
              {config.tagline}
            </span>
            <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {config.heroHeadline}
            </h1>
            <p className="mt-5 max-w-lg text-base text-white/85 sm:text-lg">
              {config.heroSubheadline}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/products"
                className="inline-flex items-center gap-2 rounded-md bg-[var(--shop-accent)] px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
              >
                {config.heroCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/track"
                className="inline-flex items-center gap-2 rounded-md border border-white/30 px-6 py-3 text-sm font-medium text-white hover:bg-white/10"
              >
                Track order
              </Link>
            </div>
          </div>
          <div className="relative hidden lg:block">
            {config.heroImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={config.heroImageUrl}
                alt=""
                className="aspect-square w-full rounded-3xl object-cover shadow-2xl"
              />
            ) : (
              <div className="aspect-square rounded-3xl bg-white/10 backdrop-blur" />
            )}
          </div>
        </div>
      </section>

      {/* Value props */}
      <section className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-black">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 sm:grid-cols-2 sm:px-6 lg:grid-cols-4">
          <Feature
            icon={<ShieldCheck className="h-6 w-6" />}
            title="Secure checkout"
            desc="Only registered users can place orders. Encrypted end-to-end."
          />
          <Feature
            icon={<CreditCard className="h-6 w-6" />}
            title="Stripe payments"
            desc="Pay safely with any major credit or debit card."
          />
          <Feature
            icon={<Bitcoin className="h-6 w-6" />}
            title="Crypto accepted"
            desc="Pay with BTC, ETH, USDC and more via Coinbase Commerce."
          />
          <Feature
            icon={<Truck className="h-6 w-6" />}
            title="Live tracking"
            desc="Follow your order on a live map, anywhere."
          />
        </div>
      </section>

      {/* Featured products */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Featured</h2>
            <p className="mt-1 text-sm text-gray-500">
              Our hand-picked favorites.
            </p>
          </div>
          <Link
            href="/products"
            className="text-sm font-medium text-[var(--shop-accent)] hover:underline"
          >
            View all →
          </Link>
        </div>
        {featured.length === 0 ? (
          <p className="text-sm text-gray-500">
            No products yet. The admin can add products in the admin panel.
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Feature({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex gap-4">
      <div className="grid h-12 w-12 flex-shrink-0 place-items-center rounded-md bg-[var(--shop-primary)] text-white">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{desc}</p>
      </div>
    </div>
  );
}
