"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "@/components/icons";
import { useState } from "react";
import { toast } from "sonner";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { RatingStars } from "@/components/shared/rating-stars";
import { useWishlist } from "@/hooks/use-wishlist";
import { useCart } from "@/hooks/use-cart";
import type { ProductCardData } from "@/types";

interface ProductCardProps {
  product: ProductCardData;
  priority?: boolean;
  className?: string;
}

/**
 * Gallery-style product card: framed poster preview with hover image swap,
 * quick wishlist + add-to-bag, discount and merchandising badges.
 */
export function ProductCard({ product, priority, className }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const { has, toggle } = useWishlist();
  const { addItem, isPending } = useCart();
  const wished = has(product.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={cn("group relative flex flex-col", className)}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-lg bg-secondary">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          {/* Matted gallery frame effect */}
          <div className="absolute inset-0 p-5 sm:p-6">
            <div className="relative h-full w-full overflow-hidden bg-background shadow-[0_2px_20px_rgba(0,0,0,0.08)]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                priority={priority}
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                className={cn(
                  "object-cover transition-opacity duration-500",
                  hovered && product.secondaryImage ? "opacity-0" : "opacity-100",
                )}
              />
              {product.secondaryImage && (
                <Image
                  src={product.secondaryImage}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, 25vw"
                  className={cn(
                    "object-cover transition-transform duration-700",
                    hovered ? "scale-105 opacity-100" : "scale-100 opacity-0",
                  )}
                />
              )}
            </div>
          </div>
        </Link>

        {/* Badges */}
        <div className="pointer-events-none absolute left-3 top-3 flex flex-col gap-1.5">
          {product.discountPercent > 0 && (
            <Badge variant="accent">−{product.discountPercent}%</Badge>
          )}
          {product.isLimitedEdition && (
            <Badge variant="default">Limited</Badge>
          )}
          {product.isNewArrival && !product.isLimitedEdition && (
            <Badge variant="outline" className="bg-background/80 backdrop-blur">
              New
            </Badge>
          )}
        </div>

        {/* Wishlist */}
        <button
          type="button"
          onClick={() => {
            toggle(product.id);
            toast.success(
              wished ? "Removed from wishlist" : "Saved to wishlist",
            );
          }}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur transition-colors hover:bg-background"
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              wished && "fill-destructive text-destructive",
            )}
          />
        </button>

        {/* Quick add */}
        <div className="absolute inset-x-3 bottom-3 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            type="button"
            disabled={!product.inStock || isPending}
            onClick={() => addItem({ productId: product.id })}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-xs font-medium text-primary-foreground shadow-lg transition-transform active:scale-[0.98] disabled:opacity-60"
          >
            <ShoppingBag className="size-4" />
            {product.inStock ? "Add to bag" : "Sold out"}
          </button>
        </div>
      </div>

      {/* Meta */}
      <div className="mt-3 flex flex-col gap-1">
        {product.artist && (
          <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
            {product.artist}
          </span>
        )}
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-1 text-sm font-medium transition-colors hover:text-accent-foreground"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-2">
          <RatingStars value={product.ratingAverage} size="sm" />
          <span className="text-xs text-muted-foreground">
            ({product.ratingCount})
          </span>
        </div>
        <div className="mt-0.5 flex items-baseline gap-2">
          <span className="text-sm font-semibold">
            {formatPrice(product.price)}
          </span>
          {product.mrp > product.price && (
            <span className="text-xs text-muted-foreground line-through">
              {formatPrice(product.mrp)}
            </span>
          )}
        </div>
      </div>
    </motion.article>
  );
}
