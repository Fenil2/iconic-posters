"use client";

import { useMemo, useState } from "react";
import {
  Heart,
  Share2,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  RotateCcw,
  Check,
  MapPin,
} from "@/components/icons";
import { toast } from "sonner";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { RatingStars } from "@/components/shared/rating-stars";
import { cn, formatPrice, calcDiscountPercent } from "@/lib/utils";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { siteConfig } from "@/config/site";
import type { ProductDetailData } from "@/types";

const uniq = (arr: string[]) => [...new Set(arr)];

export function ProductPurchase({ product }: { product: ProductDetailData }) {
  const { addItem } = useCart();
  const { has, toggle } = useWishlist();
  const wished = has(product.id);

  const sizes = useMemo(() => uniq(product.variants.map((v) => v.size)), [product]);
  const papers = useMemo(() => uniq(product.variants.map((v) => v.paperType)), [product]);
  const frames = useMemo(() => uniq(product.variants.map((v) => v.frameType)), [product]);

  const def = product.variants.find((v) => v.isDefault) ?? product.variants[0];
  const [size, setSize] = useState(def?.size ?? sizes[0]);
  const [paper, setPaper] = useState(def?.paperType ?? papers[0]);
  const [frame, setFrame] = useState(def?.frameType ?? frames[0]);
  const [qty, setQty] = useState(1);
  const [pincode, setPincode] = useState("");
  const [eta, setEta] = useState<string | null>(null);

  const variant = product.variants.find(
    (v) => v.size === size && v.paperType === paper && v.frameType === frame,
  );

  const price = variant?.price ?? product.basePrice;
  const mrp = variant?.mrp ?? product.mrp;
  const stock = variant?.stock ?? 0;
  const discount = calcDiscountPercent(mrp, price);
  const available = !!variant && stock > 0;

  const image = product.images[0]?.url ?? "/placeholder-poster.jpg";

  const handleAdd = () => {
    if (!available) return;
    addItem({
      productId: product.id,
      variantId: variant?.id,
      name: product.name,
      slug: product.slug,
      image,
      size,
      paperType: paper,
      frameType: frame,
      unitPrice: price,
      mrp,
      stock,
      quantity: qty,
    });
  };

  const share = async () => {
    const url = `${siteConfig.url}/product/${product.slug}`;
    if (navigator.share) {
      await navigator.share({ title: product.name, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      toast.success("Link copied to clipboard");
    }
  };

  const checkPincode = () => {
    if (!/^\d{6}$/.test(pincode)) {
      toast.error("Enter a valid 6-digit pincode");
      return;
    }
    const metro = ["56", "40", "11", "60", "70"].some((p) => pincode.startsWith(p));
    const days = metro ? "2–4" : "4–8";
    setEta(`Delivery to ${pincode} in ${days} business days`);
  };

  return (
    <div className="space-y-6">
      <div>
        {product.category && (
          <Link
            href={`/category/${product.category.slug}`}
            className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent hover:underline"
          >
            {product.category.name}
          </Link>
        )}
        <h1 className="mt-2 font-display text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">
          {product.name}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <RatingStars value={product.ratingAverage} showCount count={product.ratingCount} />
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {product.soldCount.toLocaleString("en-IN")}+ sold
          </span>
          {product.isLimitedEdition && <Badge>Limited Edition</Badge>}
          {product.isBestSeller && <Badge variant="accent">Best Seller</Badge>}
        </div>
      </div>

      {/* Price */}
      <div className="rounded-md border border-border bg-secondary/50 p-4">
        <div className="flex flex-wrap items-baseline gap-3">
          <span className="font-display text-4xl font-bold leading-none">
            {formatPrice(price)}
          </span>
          {mrp > price && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(mrp)}
              </span>
              <span className="rounded-sm bg-accent px-2 py-1 text-[11px] font-bold leading-none text-accent-foreground">
                −{discount}%
              </span>
            </>
          )}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Inclusive of all taxes · {product.taxRate}% GST
        </p>
      </div>

      {/* Size */}
      <Option label="Size" value={size}>
        <div className="flex flex-wrap gap-2">
          {sizes.map((s) => (
            <Chip key={s} active={s === size} onClick={() => setSize(s)}>
              {s}
            </Chip>
          ))}
        </div>
      </Option>

      {/* Paper */}
      <Option label="Paper" value={paper}>
        <div className="flex flex-wrap gap-2">
          {papers.map((p) => (
            <Chip key={p} active={p === paper} onClick={() => setPaper(p)}>
              {p}
            </Chip>
          ))}
        </div>
      </Option>

      {/* Frame */}
      <Option label="Frame" value={frame}>
        <div className="flex flex-wrap gap-2">
          {frames.map((f) => (
            <Chip key={f} active={f === frame} onClick={() => setFrame(f)}>
              {f === "None" ? "No frame" : f}
            </Chip>
          ))}
        </div>
      </Option>

      {/* Stock */}
      <div className="text-sm">
        {available ? (
          stock <= 5 ? (
            <span className="font-medium text-destructive">
              Only {stock} left in stock
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-[var(--success)]">
              <Check className="size-4" /> In stock
            </span>
          )
        ) : (
          <span className="font-medium text-muted-foreground">
            This combination is unavailable
          </span>
        )}
      </div>

      {/* Quantity + actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center rounded-sm border border-border">
          <button
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            className="grid size-11 place-items-center hover:bg-secondary"
            aria-label="Decrease quantity"
          >
            <Minus className="size-4" />
          </button>
          <span className="w-10 text-center text-sm font-medium">{qty}</span>
          <button
            onClick={() => setQty((q) => Math.min(stock || 10, q + 1))}
            className="grid size-11 place-items-center hover:bg-secondary"
            aria-label="Increase quantity"
          >
            <Plus className="size-4" />
          </button>
        </div>
        <Button
          size="lg"
          variant="outline"
          className="flex-1"
          disabled={!available}
          onClick={handleAdd}
        >
          Add to bag
        </Button>
      </div>

      <div className="flex gap-3">
        <Button size="lg" variant="accent" className="flex-1" disabled={!available} asChild>
          <Link href="/checkout" onClick={handleAdd}>
            Buy now
          </Link>
        </Button>
        <Button
          size="icon"
          variant="outline"
          className="size-13"
          onClick={() => {
            toggle(product.id);
            toast.success(wished ? "Removed from wishlist" : "Saved to wishlist");
          }}
          aria-label="Wishlist"
        >
          <Heart className={cn("size-5", wished && "fill-destructive text-destructive")} />
        </Button>
        <Button size="icon" variant="outline" className="size-13" onClick={share} aria-label="Share">
          <Share2 className="size-5" />
        </Button>
      </div>

      {/* Pincode / delivery */}
      <div className="rounded-md border border-border p-4">
        <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em]">
          <MapPin className="size-4" /> Check delivery
        </div>
        <div className="mt-3 flex gap-2">
          <Input
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            placeholder="Enter pincode"
            inputMode="numeric"
            className="h-10"
          />
          <Button variant="secondary" onClick={checkPincode} className="h-10">
            Check
          </Button>
        </div>
        {eta && (
          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-[var(--success)]">
            <Truck className="size-4" /> {eta}
          </p>
        )}
      </div>

      {/* Trust */}
      <div className="grid grid-cols-3 divide-x divide-border rounded-md border border-border py-4 text-center">
        {[
          { icon: Truck, label: `Free shipping over ${formatPrice(siteConfig.shipping.freeShippingThreshold)}` },
          { icon: RotateCcw, label: "7-day returns" },
          { icon: ShieldCheck, label: "Secure payment" },
        ].map(({ icon: Icon, label }) => (
          <div key={label} className="flex flex-col items-center gap-2 px-2">
            <Icon className="size-5 text-accent" />
            <span className="text-[10px] font-semibold uppercase leading-tight tracking-[0.08em] text-muted-foreground">
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Option({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em]">
        <span className="font-bold">{label}:</span>
        <span className="text-muted-foreground">{value === "None" ? "No frame" : value}</span>
      </div>
      {children}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "min-w-14 rounded-sm border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.08em] transition-colors",
        active
          ? "border-foreground bg-foreground text-background"
          : "border-border hover:border-foreground",
      )}
    >
      {children}
    </button>
  );
}
