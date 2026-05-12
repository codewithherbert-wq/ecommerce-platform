/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import { X, Trash2, Plus, Minus, ShoppingBag } from "lucide-react";
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
      {/* Glassmorphic Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm transition-opacity"
          onClick={close}
          aria-hidden
        />
      )}

      <div
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-[#0B0F1A] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 p-6 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-[#d9534f]" />
            <h2 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">
              Your Cart
            </h2>
            <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
              {items.length}
            </span>
          </div>
          <button
            onClick={close}
            className="group rounded-full p-2 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
            aria-label="Close cart"
          >
            <X className="h-5 w-5 text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center space-y-4 text-center">
              <div className="rounded-full bg-gray-50 p-4 dark:bg-gray-900">
                <ShoppingBag className="h-8 w-8 text-gray-300" />
              </div>
              <div>
                <p className="text-base font-medium text-gray-900 dark:text-white">
                  Your cart is empty
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  Looks like you haven't added anything yet.
                </p>
              </div>
              <button
                onClick={close}
                className="mt-4 text-sm font-semibold text-[#d9534f] hover:underline"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-6">
              {items.map((i) => (
                <li key={i.id} className="group flex gap-4">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
                    {i.imageUrl && (
                      <img
                        src={i.imageUrl}
                        alt={i.name}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>

                  <div className="flex flex-1 flex-col justify-between py-1">
                    <div>
                      <div className="flex justify-between gap-2">
                        <Link
                          href={`/products/${i.slug}`}
                          onClick={close}
                          className="text-[15px] font-semibold leading-tight text-gray-900 hover:text-[#d9534f] dark:text-white"
                        >
                          {i.name}
                        </Link>
                        <button
                          onClick={() => remove(i.id)}
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm font-medium text-gray-500">
                        {formatMoney(i.priceCents)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-lg border border-gray-200 p-1 dark:border-gray-800">
                        <button
                          onClick={() =>
                            setQty(i.id, Math.max(1, i.quantity - 1))
                          }
                          className="rounded-md p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="min-w-[2rem] text-center text-sm font-semibold">
                          {i.quantity}
                        </span>
                        <button
                          onClick={() => setQty(i.id, i.quantity + 1)}
                          className="rounded-md p-1 transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {formatMoney(i.priceCents * i.quantity)}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-900/50">
            <div className="space-y-2 pb-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-base font-medium text-gray-900 dark:text-white">
                  Subtotal
                </span>
                <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                  {formatMoney(subtotal)}
                </span>
              </div>
            </div>
            <Link
              href="/checkout"
              onClick={close}
              className="flex w-full items-center justify-center rounded-xl bg-[#111827] py-4 text-sm font-bold text-white shadow-lg transition-all hover:bg-[#1f2937] hover:shadow-xl active:scale-[0.98]"
            >
              Secure Checkout
            </Link>
            <p className="mt-4 text-center text-xs text-gray-400">
              Free shipping on all orders over $80.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
