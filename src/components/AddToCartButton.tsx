"use client";

import { useState } from "react";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCart, type CartItem } from "@/stores/cart-store";
import { useUI } from "@/stores/ui-store";
import { toast } from "sonner";

export function AddToCartButton({
  product,
}: {
  product: Omit<CartItem, "quantity">;
}) {
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const openCart = useUI((s) => s.openCart);

  const disabled = product.stock <= 0;

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="inline-flex items-center rounded-md border border-gray-300 dark:border-gray-700">
        <button
          onClick={() => setQty((q) => Math.max(1, q - 1))}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Decrease quantity"
        >
          <Minus className="h-4 w-4" />
        </button>
        <span className="w-10 text-center text-sm">{qty}</span>
        <button
          onClick={() =>
            setQty((q) => Math.min(product.stock || 99, q + 1))
          }
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Increase quantity"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      <button
        disabled={disabled}
        onClick={() => {
          add(product, qty);
          toast.success(`${product.name} added to cart`);
          openCart();
        }}
        className="inline-flex items-center gap-2 rounded-md bg-[var(--shop-primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-50"
      >
        <ShoppingCart className="h-4 w-4" />
        {disabled ? "Out of stock" : "Add to cart"}
      </button>
    </div>
  );
}
