import { db } from "@/lib/db";
import { products, categories } from "@/lib/db/schema";
import type { Product } from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category } = await searchParams;

  const cats = await db
    .select()
    .from(categories)
    .orderBy(categories.sortOrder);

  let list: Product[] = [];
  try {
    if (category) {
      const cat = cats.find((c) => c.slug === category);
      if (cat) {
        list = await db
          .select()
          .from(products)
          .where(
            and(eq(products.active, true), eq(products.categoryId, cat.id))
          )
          .orderBy(desc(products.createdAt));
      }
    } else {
      list = await db
        .select()
        .from(products)
        .where(eq(products.active, true))
        .orderBy(desc(products.createdAt));
    }
  } catch {
    list = [];
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">All products</h1>

      {cats.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/products"
            className={`rounded-full border px-3 py-1 text-sm ${
              !category
                ? "border-[var(--shop-primary)] bg-[var(--shop-primary)] text-white"
                : "border-gray-300 hover:border-gray-500"
            }`}
          >
            All
          </Link>
          {cats.map((c) => (
            <Link
              key={c.id}
              href={`/products?category=${c.slug}`}
              className={`rounded-full border px-3 py-1 text-sm ${
                category === c.slug
                  ? "border-[var(--shop-primary)] bg-[var(--shop-primary)] text-white"
                  : "border-gray-300 hover:border-gray-500"
              }`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {list.length === 0 ? (
        <p className="mt-10 text-center text-sm text-gray-500">
          No products found.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {list.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
