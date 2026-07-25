import { ProductCard } from "./product-card";
import { cn } from "@/lib/utils";
import type { ProductCardData } from "@/types";

interface ProductGridProps {
  products: ProductCardData[];
  className?: string;
  priorityCount?: number;
}

/** Responsive product grid used on listing, search and collection pages. */
export function ProductGrid({
  products,
  className,
  priorityCount = 4,
}: ProductGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {products.map((p, i) => (
        <ProductCard key={p.id} product={p} priority={i < priorityCount} />
      ))}
    </div>
  );
}
