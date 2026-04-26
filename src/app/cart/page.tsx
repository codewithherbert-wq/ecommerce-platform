"use client";

import Link from "next/link";
import { useCart } from "@/stores/cart-store";
import { formatMoney } from "@/lib/utils";
import { Trash2, Plus, Minus } from "lucide-react";

export default function CartPage() {
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQuantity);
  const subtotal = useCart((s) => s.subtotalCents());

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-3xl font-bold">Your cart</h1>
      {items.length === 0 ? (
        <div className="mt-10 rounded-lg border border-dashed border-gray-300 p-12 text-center dark:border-gray-700">
          <p className="text-gray-500">Your cart is empty.</p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded-md bg-[var(--shop-primary)] px-5 py-2 text-sm font-medium text-white"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_320px]">
          <ul className="divide-y divide-gray-200 dark:divide-gray-800">
            {items.map((i) => (
              <li key={i.id} className="flex gap-4 py-4">
                <div className="h-24 w-24 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
                  {i.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={i.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <Link
                    href={`/products/${i.slug}`}
                    className="font-medium hover:underline"
                  >
                    {i.name}
                  </Link>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatMoney(i.priceCents)}
                  </div>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="inline-flex items-center rounded border border-gray-300 dark:border-gray-700">
                      <button
                        onClick={() => setQty(i.id, i.quantity - 1)}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-sm">
                        {i.quantity}
                      </span>
                      <button
                        onClick={() => setQty(i.id, i.quantity + 1)}
                        className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      onClick={() => remove(i.id)}
                      className="text-sm text-red-600 inline-flex items-center gap-1 hover:underline"
                    >
                      <Trash2 className="h-4 w-4" /> Remove
                    </button>
                  </div>
                </div>
                <div className="text-right font-semibold">
                  {formatMoney(i.priceCents * i.quantity)}
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-lg border border-gray-200 p-5 dark:border-gray-800">
            <h2 className="text-lg font-semibold">Summary</h2>
            <div className="mt-4 flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>
            <div className="mt-1 flex justify-between text-sm text-gray-500">
              <span>Shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <Link
              href="/checkout"
              className="mt-6 block rounded-md bg-[var(--shop-primary)] py-3 text-center text-sm font-medium text-white hover:opacity-90"
            >
              Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  );
}
