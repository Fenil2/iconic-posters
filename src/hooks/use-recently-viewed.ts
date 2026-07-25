"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useEffect } from "react";
import type { ProductCardData } from "@/types";

interface RecentlyViewedState {
  items: ProductCardData[];
  add: (item: ProductCardData) => void;
  clear: () => void;
}

export const useRecentlyViewedStore = create<RecentlyViewedState>()(
  persist(
    (set) => ({
      items: [],
      add: (item) =>
        set((state) => ({
          items: [item, ...state.items.filter((i) => i.id !== item.id)].slice(0, 12),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "pulse-recently-viewed" },
  ),
);

/** Record a product view on mount (call from the product page). */
export function useTrackRecentlyViewed(product: ProductCardData) {
  const add = useRecentlyViewedStore((s) => s.add);
  useEffect(() => {
    add(product);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product.id]);
}

export function useRecentlyViewed() {
  return useRecentlyViewedStore((s) => s.items);
}
