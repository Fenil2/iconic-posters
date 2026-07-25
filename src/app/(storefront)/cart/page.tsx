"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrderSummary } from "@/components/checkout/order-summary";
import { useCart, lineKey } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import { formatPrice } from "@/lib/utils";

export default function CartPage() {
  const { items, updateQty, remove, subtotal } = useCart();
  const { toggle } = useWishlist();

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 px-4 py-28 text-center">
        <div className="grid size-20 place-items-center rounded-full bg-secondary">
          <ShoppingBag className="size-8 text-muted-foreground" />
        </div>
        <div>
          <h1 className="font-serif text-2xl font-semibold">Your bag is empty</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Discover posters worth framing — start with our best sellers.
          </p>
        </div>
        <div className="flex gap-3">
          <Button asChild>
            <Link href="/shop">Shop all posters</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/best-sellers">Best sellers</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">
        Shopping Bag
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {items.length} {items.length === 1 ? "item" : "items"} in your bag
      </p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_380px]">
        {/* Items */}
        <div className="divide-y divide-border">
          {items.map((item) => {
            const key = lineKey(item.productId, item.variantId);
            return (
              <div key={key} className="flex gap-4 py-6 first:pt-0">
                <Link
                  href={`/product/${item.slug}`}
                  className="relative size-28 shrink-0 overflow-hidden rounded-lg bg-secondary sm:size-32"
                >
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <Link
                        href={`/product/${item.slug}`}
                        className="font-medium hover:underline"
                      >
                        {item.name}
                      </Link>
                      {(item.size || item.frameType) && (
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          {[item.size, item.paperType, item.frameType]
                            .filter(Boolean)
                            .join(" · ")}
                        </p>
                      )}
                    </div>
                    <p className="font-semibold">
                      {formatPrice(item.unitPrice * item.quantity)}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-wrap items-center gap-4 pt-3">
                    <div className="flex items-center rounded-md border border-border">
                      <button
                        onClick={() => updateQty(key, item.quantity - 1)}
                        className="grid size-9 place-items-center hover:bg-secondary"
                        aria-label="Decrease"
                      >
                        <Minus className="size-3.5" />
                      </button>
                      <span className="w-9 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() => updateQty(key, item.quantity + 1)}
                        className="grid size-9 place-items-center hover:bg-secondary"
                        aria-label="Increase"
                      >
                        <Plus className="size-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        toggle(item.productId);
                        remove(key);
                      }}
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
                    >
                      <Heart className="size-4" /> Save for later
                    </button>
                    <button
                      onClick={() => remove(key)}
                      className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="size-4" /> Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-6">
            <Button variant="ghost" asChild>
              <Link href="/shop">
                <ArrowRight className="size-4 rotate-180" /> Continue shopping
              </Link>
            </Button>
          </div>
        </div>

        {/* Summary */}
        <div className="lg:sticky lg:top-24 lg:self-start">
          <OrderSummary subtotal={subtotal} showCoupon>
            <Button size="lg" className="mt-2 w-full" asChild>
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="size-4" />
              </Link>
            </Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              Secure checkout · Razorpay · UPI · Cards · COD
            </p>
          </OrderSummary>
        </div>
      </div>
    </div>
  );
}
