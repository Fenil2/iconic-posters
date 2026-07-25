"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { ProductGrid } from "@/components/product/product-grid";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWishlist } from "@/hooks/use-wishlist";
import type { ProductCardData } from "@/types";

async function fetchProducts(ids: string[]): Promise<ProductCardData[]> {
  if (!ids.length) return [];
  const res = await fetch("/api/products/by-ids", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return data.products ?? [];
}

export default function WishlistPage() {
  const { ids } = useWishlist();
  const { data, isLoading } = useQuery({
    queryKey: ["wishlist", ids],
    queryFn: () => fetchProducts(ids),
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">Wishlist</h1>

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-[3/4] w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-24 text-center">
          <Heart className="size-10 text-muted-foreground" />
          <div>
            <p className="font-medium">Your wishlist is empty</p>
            <p className="text-sm text-muted-foreground">
              Tap the heart on any poster to save it here.
            </p>
          </div>
          <Button asChild>
            <Link href="/shop">Browse posters</Link>
          </Button>
        </div>
      ) : (
        <ProductGrid products={data} />
      )}
    </div>
  );
}
