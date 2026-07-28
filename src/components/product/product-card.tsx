"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, ShoppingBag } from "@/components/icons";
import { useState } from "react";
import { toast } from "sonner";
import { cn, formatPrice } from "@/lib/utils";
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
 * Retail poster card: full-bleed artwork, hover image swap, a hot-red discount
 * flag and an always-visible add-to-bag bar — the pattern shoppers expect from
 * an Indian poster store.
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
      className={cn(
        "group relative flex h-full flex-col overflow-hidden rounded-md border border-border bg-card transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.10)]",
        className,
      )}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-secondary">
        <Link href={`/product/${product.slug}`} aria-label={product.name}>
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "object-cover transition-all duration-500",
              hovered && product.secondaryImage
                ? "opacity-0"
                : "opacity-100 group-hover:scale-[1.03]",
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
        </Link>

        {/* Discount flag + merchandising tags */}
        <div className="pointer-events-none absolute left-0 top-2.5 flex flex-col items-start gap-1.5">
          {product.discountPercent > 0 && (
            <span className="rounded-r-sm bg-accent px-2.5 py-1 text-[11px] font-bold leading-none tracking-wide text-accent-foreground">
              −{product.discountPercent}%
            </span>
          )}
          {product.isLimitedEdition && (
            <span className="rounded-r-sm bg-foreground px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.12em] text-background">
              Limited
            </span>
          )}
          {product.isNewArrival && !product.isLimitedEdition && (
            <span className="rounded-r-sm bg-background/90 px-2.5 py-1 text-[10px] font-bold uppercase leading-none tracking-[0.12em] text-foreground backdrop-blur">
              New
            </span>
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
          className="absolute right-2.5 top-2.5 grid size-8 place-items-center rounded-full bg-background/85 text-foreground shadow-sm backdrop-blur transition-colors hover:bg-background"
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              wished && "fill-accent text-accent",
            )}
          />
        </button>

        {!product.inStock && (
          <div className="absolute inset-0 grid place-items-center bg-background/55 backdrop-blur-[1px]">
            <span className="rounded-sm bg-foreground px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-background">
              Sold out
            </span>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        {product.artist && (
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {product.artist}
          </span>
        )}
        <Link
          href={`/product/${product.slug}`}
          className="line-clamp-2 text-[13px] font-medium leading-snug transition-colors hover:text-accent"
        >
          {product.name}
        </Link>

        <div className="flex items-center gap-1.5">
          <RatingStars value={product.ratingAverage} size="sm" />
          <span className="text-[11px] text-muted-foreground">
            ({product.ratingCount})
          </span>
        </div>

        <div className="mt-auto flex flex-wrap items-baseline gap-x-2 gap-y-0.5 pt-1">
          <span className="font-display text-lg font-bold leading-none">
            {formatPrice(product.price)}
          </span>
          {product.mrp > product.price && (
            <>
              <span className="text-xs text-muted-foreground line-through">
                {formatPrice(product.mrp)}
              </span>
              {product.discountPercent > 0 && (
                <span className="text-[11px] font-bold text-accent">
                  ({product.discountPercent}% OFF)
                </span>
              )}
            </>
          )}
        </div>

        <button
          type="button"
          disabled={!product.inStock || isPending}
          onClick={() =>
            addItem({
              productId: product.id,
              name: product.name,
              slug: product.slug,
              image: product.image,
              unitPrice: product.price,
              mrp: product.mrp,
            })
          }
          className="mt-2 flex w-full items-center justify-center gap-2 rounded-sm border border-foreground bg-background px-3 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors hover:bg-foreground hover:text-background disabled:cursor-not-allowed disabled:border-border disabled:bg-secondary disabled:text-muted-foreground"
        >
          <ShoppingBag className="size-3.5" />
          {product.inStock ? "Add to bag" : "Sold out"}
        </button>
      </div>
    </motion.article>
  );
}
