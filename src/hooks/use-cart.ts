"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useCallback, useState, useTransition } from "react";
import { toast } from "sonner";

export interface LocalCartItem {
  productId: string;
  variantId?: string;
  name: string;
  slug: string;
  image: string;
  size?: string;
  paperType?: string;
  frameType?: string;
  unitPrice: number;
  mrp: number;
  quantity: number;
  stock: number;
}

interface CartState {
  items: LocalCartItem[];
  add: (item: LocalCartItem) => void;
  updateQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
}

/** Stable key for a product+variant line. */
export const lineKey = (productId: string, variantId?: string) =>
  `${productId}::${variantId ?? "default"}`;

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((state) => {
          const key = lineKey(item.productId, item.variantId);
          const existing = state.items.find(
            (i) => lineKey(i.productId, i.variantId) === key,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                lineKey(i.productId, i.variantId) === key
                  ? { ...i, quantity: Math.min(i.quantity + item.quantity, i.stock || 99) }
                  : i,
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      updateQty: (key, qty) =>
        set((state) => ({
          items: state.items
            .map((i) =>
              lineKey(i.productId, i.variantId) === key
                ? { ...i, quantity: Math.max(1, qty) }
                : i,
            )
            .filter((i) => i.quantity > 0),
        })),
      remove: (key) =>
        set((state) => ({
          items: state.items.filter(
            (i) => lineKey(i.productId, i.variantId) !== key,
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "pulse-cart" },
  ),
);

/**
 * Ergonomic cart hook. `addItem` optimistically updates the local store
 * (guest-friendly) and would sync to the server when authenticated.
 */
export function useCart() {
  const store = useCartStore();
  const [isPending, startTransition] = useTransition();
  const [hydrated, setHydrated] = useState(false);

  // Avoid SSR/CSR count mismatch by reading counts only after mount.
  useState(() => {
    if (typeof window !== "undefined") setHydrated(true);
  });

  const addItem = useCallback(
    (partial: Partial<LocalCartItem> & { productId: string }) => {
      startTransition(() => {
        store.add({
          quantity: 1,
          name: partial.name ?? "",
          slug: partial.slug ?? "",
          image: partial.image ?? "/placeholder-poster.jpg",
          unitPrice: partial.unitPrice ?? 0,
          mrp: partial.mrp ?? 0,
          stock: partial.stock ?? 99,
          ...partial,
        });
        toast.success("Added to bag");
      });
    },
    [store],
  );

  const subtotal = store.items.reduce(
    (sum, i) => sum + i.unitPrice * i.quantity,
    0,
  );
  const count = store.items.reduce((sum, i) => sum + i.quantity, 0);

  return {
    items: store.items,
    addItem,
    updateQty: store.updateQty,
    remove: store.remove,
    clear: store.clear,
    subtotal,
    count: hydrated ? count : 0,
    isPending,
  };
}
