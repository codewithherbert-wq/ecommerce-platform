"use client";

import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";
import { useCart } from "@/stores/cart-store";
import { useUI } from "@/stores/ui-store";
import { formatMoney } from "@/lib/utils";
import { toast } from "sonner";
import type { Product } from "@/lib/db/schema";

export function ProductCard({ product }: { product: Product }) {
  const add = useCart((s) => s.add);
  const openCart = useUI((s) => s.openCart);

  const hasDiscount =
    product.compareAtPriceCents &&
    product.compareAtPriceCents > product.priceCents;

  const discountPct = hasDiscount
    ? Math.round((1 - product.priceCents / product.compareAtPriceCents!) * 100)
    : null;

  return (
    <div className="group flex flex-col">
      {/* ── Image area ── */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
        <Link
          href={`/products/${product.slug}`}
          className="block h-full w-full"
        >
          {product.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
              No image
            </div>
          )}
        </Link>

        {/* Badge — top left */}
        {product.featured && !hasDiscount && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
            Bestseller
          </span>
        )}
        {discountPct && (
          <span className="absolute left-3 top-3 rounded-full bg-red-500 px-2.5 py-1 text-[10px] font-bold text-white shadow-sm">
            {discountPct}% OFF
          </span>
        )}

        {/* Heart — top right */}
        <button
          aria-label="Wishlist"
          className="absolute right-2.5 top-2.5 grid h-8 w-8 place-items-center rounded-full bg-white/90 shadow-sm backdrop-blur-sm transition hover:scale-110 hover:bg-white dark:bg-gray-900/80 dark:hover:bg-gray-900"
        >
          <Heart className="h-3.5 w-3.5 text-gray-500 dark:text-gray-300" />
        </button>
      </div>

      {/* ── Info below image ── */}
      <div className="mt-2.5 px-0.5">
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-1 text-[13px] font-medium text-gray-700 dark:text-gray-200 transition hover:text-[var(--shop-accent)]"
        >
          {product.name}
        </Link>
        <div className="mt-1 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-bold text-gray-900 dark:text-white">
              {formatMoney(product.priceCents, product.currency)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-gray-400 line-through">
                {formatMoney(product.compareAtPriceCents!, product.currency)}
              </span>
            )}
          </div>

          {/* Add to cart button */}
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
                1,
              );
              toast.success(`${product.name} added to cart`);
              openCart();
            }}
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-[var(--shop-primary)] px-3 py-2 text-xs font-semibold text-white transition hover:opacity-90 hover:scale-[1.02] active:scale-100 disabled:opacity-40 cursor-pointer"
          >
            <ShoppingCart className="h-3.5 w-3.5" />
            {product.stock > 0 ? "Add to cart" : "Out of stock"}
          </button>
        </div>
      </div>
    </div>
  );
}
