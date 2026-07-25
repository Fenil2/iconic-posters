"use client";

import { useState } from "react";
import { Tag, X, Loader2, Gift } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice } from "@/lib/utils";
import { computeTotals } from "@/lib/pricing";
import { useCoupon } from "@/hooks/use-coupon";

interface OrderSummaryProps {
  subtotal: number;
  taxRate?: number;
  giftWrap?: boolean;
  onGiftWrapChange?: (v: boolean) => void;
  showCoupon?: boolean;
  showGiftWrap?: boolean;
  codFee?: number;
  children?: React.ReactNode;
}

/** Price breakdown card with coupon + optional gift wrap, shared by cart & checkout. */
export function OrderSummary({
  subtotal,
  taxRate = 0,
  giftWrap = false,
  onGiftWrapChange,
  showCoupon = true,
  showGiftWrap = false,
  codFee = 0,
  children,
}: OrderSummaryProps) {
  const { coupon, apply, remove, loading } = useCoupon(subtotal);
  const [code, setCode] = useState("");
  const totals = computeTotals({ subtotal, coupon, giftWrap, taxRate, codFee });

  return (
    <div className="space-y-4 rounded-xl border border-border p-5">
      <h2 className="font-semibold">Order Summary</h2>

      {showCoupon && (
        <div>
          {coupon ? (
            <div className="flex items-center justify-between rounded-lg bg-secondary/60 px-3 py-2.5">
              <span className="inline-flex items-center gap-2 text-sm font-medium">
                <Tag className="size-4 text-[var(--success)]" />
                {coupon.code} applied
              </span>
              <button onClick={remove} aria-label="Remove coupon">
                <X className="size-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="h-10"
                onKeyDown={(e) => e.key === "Enter" && apply(code)}
              />
              <Button
                variant="secondary"
                className="h-10"
                disabled={loading}
                onClick={() => apply(code)}
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : "Apply"}
              </Button>
            </div>
          )}
          <p className="mt-1.5 text-xs text-muted-foreground">
            Try <span className="font-medium">PULSE10</span> or{" "}
            <span className="font-medium">FREESHIP</span>
          </p>
        </div>
      )}

      {showGiftWrap && (
        <label className="flex cursor-pointer items-center justify-between rounded-lg border border-border px-3 py-2.5">
          <span className="inline-flex items-center gap-2 text-sm">
            <Gift className="size-4" /> Add gift wrap (+{formatPrice(49)})
          </span>
          <input
            type="checkbox"
            checked={giftWrap}
            onChange={(e) => onGiftWrapChange?.(e.target.checked)}
            className="size-4 accent-[var(--primary)]"
          />
        </label>
      )}

      <Separator />

      <div className="space-y-2 text-sm">
        <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
        {totals.discount > 0 && (
          <Row
            label="Discount"
            value={`− ${formatPrice(totals.discount)}`}
            className="text-[var(--success)]"
          />
        )}
        <Row
          label="Shipping"
          value={totals.shipping === 0 ? "Free" : formatPrice(totals.shipping)}
        />
        {totals.tax > 0 && <Row label="Tax" value={formatPrice(totals.tax)} />}
        {totals.giftWrap > 0 && (
          <Row label="Gift wrap" value={formatPrice(totals.giftWrap)} />
        )}
        {codFee > 0 && <Row label="COD fee" value={formatPrice(codFee)} />}
      </div>

      <Separator />

      <div className="flex items-center justify-between">
        <span className="font-semibold">Total</span>
        <span className="text-xl font-semibold">{formatPrice(totals.total)}</span>
      </div>
      <p className="text-xs text-muted-foreground">
        {taxRate === 0 ? "Inclusive of all taxes." : "Taxes calculated above."}
      </p>

      {children}
    </div>
  );
}

function Row({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={className}>{value}</span>
    </div>
  );
}
