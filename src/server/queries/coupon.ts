import "server-only";
import { prisma } from "@/lib/prisma";
import type { AppliedCoupon } from "@/lib/pricing";

export interface CouponResult {
  ok: boolean;
  error?: string;
  coupon?: AppliedCoupon;
}

/** Validate a coupon code against the catalogue rules for a given subtotal. */
export async function validateCoupon(
  code: string,
  subtotal: number,
  userId?: string,
): Promise<CouponResult> {
  const coupon = await prisma.coupon.findUnique({
    where: { code: code.trim().toUpperCase() },
  });

  if (!coupon || !coupon.isActive) {
    return { ok: false, error: "Invalid or expired coupon code" };
  }

  const now = new Date();
  if (coupon.startsAt && coupon.startsAt > now) {
    return { ok: false, error: "This coupon isn't active yet" };
  }
  if (coupon.expiresAt && coupon.expiresAt < now) {
    return { ok: false, error: "This coupon has expired" };
  }
  if (coupon.usageLimit != null && coupon.usageCount >= coupon.usageLimit) {
    return { ok: false, error: "This coupon has reached its usage limit" };
  }
  if (subtotal < Number(coupon.minPurchase)) {
    return {
      ok: false,
      error: `Add ₹${Math.round(Number(coupon.minPurchase) - subtotal)} more to use this coupon`,
    };
  }

  if (userId && coupon.perUserLimit != null) {
    const used = await prisma.couponRedemption.count({
      where: { couponId: coupon.id, userId },
    });
    if (used >= coupon.perUserLimit) {
      return { ok: false, error: "You've already used this coupon" };
    }
  }

  return {
    ok: true,
    coupon: {
      code: coupon.code,
      type: coupon.type,
      value: Number(coupon.value),
      maxDiscount: coupon.maxDiscount ? Number(coupon.maxDiscount) : null,
    },
  };
}
