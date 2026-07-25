"use client";

import { useTrackRecentlyViewed } from "@/hooks/use-recently-viewed";
import type { ProductCardData } from "@/types";

/** Invisible client component that records a product view for the rail. */
export function RecentlyViewedTracker({ product }: { product: ProductCardData }) {
  useTrackRecentlyViewed(product);
  return null;
}
