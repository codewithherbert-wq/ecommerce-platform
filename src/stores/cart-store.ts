"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CartItem = {
  id: string; // product id
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string | null;
  quantity: number;
  stock: number;
};

type CartState = {
  items: CartItem[];
  add: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, qty: number) => void;
  clear: () => void;
  subtotalCents: () => number;
  count: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item, qty = 1) =>
        set((s) => {
          const existing = s.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.id === item.id
                  ? {
                      ...i,
                      quantity: Math.min(i.quantity + qty, i.stock || 999),
                    }
                  : i
              ),
            };
          }
          return {
            items: [
              ...s.items,
              { ...item, quantity: Math.min(qty, item.stock || 999) },
            ],
          };
        }),
      remove: (id) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
      setQuantity: (id, qty) =>
        set((s) => ({
          items: s.items
            .map((i) =>
              i.id === id
                ? { ...i, quantity: Math.max(0, Math.min(qty, i.stock || 999)) }
                : i
            )
            .filter((i) => i.quantity > 0),
        })),
      clear: () => set({ items: [] }),
      subtotalCents: () =>
        get().items.reduce(
          (sum, i) => sum + i.priceCents * i.quantity,
          0
        ),
      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
    }),
    {
      name: "cart-v1",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
