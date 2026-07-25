"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2, X } from "@/components/icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart, lineKey } from "@/hooks/use-cart";
import { formatPrice } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const { items, updateQty, remove, subtotal } = useCart();
  const freeShip = siteConfig.shipping.freeShippingThreshold;
  const remaining = Math.max(0, freeShip - subtotal);
  const progress = Math.min(100, (subtotal / freeShip) * 100);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="size-4" />
            Your Bag ({items.length})
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <div className="grid size-16 place-items-center rounded-full bg-secondary">
              <ShoppingBag className="size-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Your bag is empty</p>
              <p className="text-sm text-muted-foreground">
                Curated wall art is one click away.
              </p>
            </div>
            <Button onClick={() => onOpenChange(false)} asChild>
              <Link href="/shop">Start shopping</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto scrollbar-thin px-6 py-4">
              {/* Free shipping progress */}
              <div className="mb-4 rounded-lg bg-secondary/60 p-3">
                <p className="text-xs text-muted-foreground">
                  {remaining > 0 ? (
                    <>
                      Add <span className="font-semibold text-foreground">{formatPrice(remaining)}</span> for free shipping
                    </>
                  ) : (
                    <span className="font-medium text-foreground">
                      🎉 You’ve unlocked free shipping!
                    </span>
                  )}
                </p>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <ul className="divide-y divide-border">
                {items.map((item) => {
                  const key = lineKey(item.productId, item.variantId);
                  return (
                    <li key={key} className="flex gap-3 py-4">
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-md bg-secondary">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/product/${item.slug}`}
                            onClick={() => onOpenChange(false)}
                            className="line-clamp-2 text-sm font-medium hover:underline"
                          >
                            {item.name}
                          </Link>
                          <button
                            onClick={() => remove(key)}
                            aria-label="Remove"
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        {(item.size || item.frameType) && (
                          <p className="text-xs text-muted-foreground">
                            {[item.size, item.paperType, item.frameType]
                              .filter(Boolean)
                              .join(" · ")}
                          </p>
                        )}
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div className="flex items-center rounded-md border border-border">
                            <button
                              onClick={() => updateQty(key, item.quantity - 1)}
                              className="grid size-8 place-items-center hover:bg-secondary"
                              aria-label="Decrease"
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQty(key, item.quantity + 1)}
                              className="grid size-8 place-items-center hover:bg-secondary"
                              aria-label="Increase"
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>
                          <span className="text-sm font-semibold">
                            {formatPrice(item.unitPrice * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>

            <SheetFooter>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-lg font-semibold">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <Separator />
              <p className="text-xs text-muted-foreground">
                Shipping & taxes calculated at checkout.
              </p>
              <Button size="lg" className="w-full" asChild>
                <Link href="/checkout" onClick={() => onOpenChange(false)}>
                  Checkout
                </Link>
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => onOpenChange(false)}
                asChild
              >
                <Link href="/cart">View full bag</Link>
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
