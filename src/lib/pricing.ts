import { siteConfig } from "@/config/site";
import type { PriceBreakdown } from "@/types";

export interface AppliedCoupon {
  code: string;
  type: "PERCENTAGE" | "FLAT" | "FREE_SHIPPING";
  value: number;
  maxDiscount?: number | null;
}

export interface PricingInput {
  subtotal: number;
  coupon?: AppliedCoupon | null;
  giftWrap?: boolean;
  /** Average tax rate across items (percent). Defaults to 0 if items are tax-inclusive. */
  taxRate?: number;
  codFee?: number;
}

const GIFT_WRAP_FEE = 49;

/** Single source of truth for order totals — used by cart, checkout & server. */
export function computeTotals({
  subtotal,
  coupon,
  giftWrap = false,
  taxRate = 0,
  codFee = 0,
}: PricingInput): PriceBreakdown {
  let discount = 0;
  let shipping =
    subtotal >= siteConfig.shipping.freeShippingThreshold || subtotal === 0
      ? 0
      : siteConfig.shipping.standardFee;

  if (coupon) {
    if (coupon.type === "PERCENTAGE") {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
    } else if (coupon.type === "FLAT") {
      discount = Math.min(coupon.value, subtotal);
    } else if (coupon.type === "FREE_SHIPPING") {
      shipping = 0;
    }
  }

  discount = Math.round(discount);
  const giftWrapFee = giftWrap ? GIFT_WRAP_FEE : 0;
  const taxable = Math.max(0, subtotal - discount);
  const tax = Math.round((taxable * taxRate) / 100);
  const total = Math.max(0, taxable + shipping + tax + giftWrapFee + codFee);

  return {
    subtotal: Math.round(subtotal),
    discount,
    shipping,
    tax,
    giftWrap: giftWrapFee,
    total: Math.round(total),
  };
}

export { GIFT_WRAP_FEE };
