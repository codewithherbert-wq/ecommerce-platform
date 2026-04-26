"use client";

import Link from "next/link";
import { X, Trash2, Plus, Minus } from "lucide-react";
import { useCart } from "@/stores/cart-store";
import { useUI } from "@/stores/ui-store";
import { formatMoney } from "@/lib/utils";

export function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const close = useUI((s) => s.closeCart);
  const items = useCart((s) => s.items);
  const remove = useCart((s) => s.remove);
  const setQty = useCart((s) => s.setQuantity);
  const subtotal = useCart((s) => s.subtotalCents());

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/50"
          onClick={close}
          aria-hidden
        />
      )}
      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-xl transition-transform dark:bg-gray-900 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-800">
          <h2 className="text-lg font-semibold">Your cart</h2>
          <button
            onClick={close}
            className="rounded p-1 hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <p className="mt-20 text-center text-sm text-gray-500">
              Your cart is empty.
            </p>
          ) : (
            <ul className="space-y-4">
              {items.map((i) => (
                <li key={i.id} className="flex gap-3">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded bg-gray-100 dark:bg-gray-800">
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
                      onClick={close}
                      className="text-sm font-medium hover:underline"
                    >
                      {i.name}
                    </Link>
                    <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                      {formatMoney(i.priceCents)}
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={() => setQty(i.id, i.quantity - 1)}
                        className="rounded border border-gray-300 p-1 dark:border-gray-700"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-6 text-center text-sm">
                        {i.quantity}
                      </span>
                      <button
                        onClick={() => setQty(i.id, i.quantity + 1)}
                        className="rounded border border-gray-300 p-1 dark:border-gray-700"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => remove(i.id)}
                        className="ml-auto rounded p-1 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 dark:border-gray-800">
            <div className="mb-3 flex items-center justify-between">
              <span className="text-sm">Subtotal</span>
              <span className="text-base font-semibold">
                {formatMoney(subtotal)}
              </span>
            </div>
            <Link
              href="/checkout"
              onClick={close}
              className="block w-full rounded-md bg-[var(--shop-primary)] py-3 text-center text-sm font-medium text-white hover:opacity-90"
            >
              Checkout
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
