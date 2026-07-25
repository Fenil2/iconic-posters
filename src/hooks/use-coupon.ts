"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { useState } from "react";
import { toast } from "sonner";
import type { AppliedCoupon } from "@/lib/pricing";

interface CouponState {
  coupon: AppliedCoupon | null;
  setCoupon: (c: AppliedCoupon | null) => void;
}

export const useCouponStore = create<CouponState>()(
  persist(
    (set) => ({
      coupon: null,
      setCoupon: (c) => set({ coupon: c }),
    }),
    { name: "pulse-coupon" },
  ),
);

/** Coupon apply/remove with server validation against the current subtotal. */
export function useCoupon(subtotal: number) {
  const { coupon, setCoupon } = useCouponStore();
  const [loading, setLoading] = useState(false);

  const apply = async (code: string) => {
    if (!code.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        toast.error(data.error ?? "Invalid coupon");
        return false;
      }
      setCoupon(data.coupon);
      toast.success(`Coupon ${data.coupon.code} applied`);
      return true;
    } catch {
      toast.error("Could not validate coupon");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const remove = () => {
    setCoupon(null);
    toast.success("Coupon removed");
  };

  return { coupon, apply, remove, loading };
}
