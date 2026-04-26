"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/stores/cart-store";
import { useUI } from "@/stores/ui-store";
import { formatMoney } from "@/lib/utils";
import { toast } from "sonner";
import type { Product } from "@/lib/db/schema";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const openCart = useUI((s) => s.openCart);

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white transition hover:shadow-lg dark:border-gray-800 dark:bg-gray-900">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="aspect-square w-full overflow-hidden bg-gray-100 dark:bg-gray-800">
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gray-400">
              No image
            </div>
          )}
        </div>
      </Link>
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <Link
            href={`/products/${product.slug}`}
            className="text-sm font-medium line-clamp-2 hover:text-[var(--shop-accent)]"
          >
            {product.name}
          </Link>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-base font-semibold">
              {formatMoney(product.priceCents, product.currency)}
            </span>
            {product.compareAtPriceCents &&
              product.compareAtPriceCents > product.priceCents && (
                <span className="text-xs text-gray-500 line-through">
                  {formatMoney(product.compareAtPriceCents, product.currency)}
                </span>
              )}
          </div>
        </div>
        <button
          disabled={product.stock <= 0}
          onClick={() => {
            add(
              {
                id: product.id,
                slug: product.slug,
                name: product.name,
                priceCents: product.priceCents,
                imageUrl: product.imageUrl,
                stock: product.stock,
              },
              1
            );
            toast.success(`${product.name} added to cart`);
            openCart();
          }}
          className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-md bg-[var(--shop-primary)] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90 disabled:opacity-50"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          {product.stock > 0 ? "Add to cart" : "Out of stock"}
        </button>
      </div>
    </div>
  );
}
