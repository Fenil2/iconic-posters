"use client";

import { useState, useTransition } from "react";
import { Plus, Trash2, Loader2, Ticket } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { createCoupon, toggleCoupon, deleteCoupon } from "@/server/actions/coupon";
import { formatPrice, formatDate } from "@/lib/utils";

export interface CouponRow {
  id: string;
  code: string;
  description: string | null;
  type: string;
  value: number;
  minPurchase: number;
  usageLimit: number | null;
  usageCount: number;
  isActive: boolean;
  expiresAt: string | null;
}

export function CouponManager({ coupons }: { coupons: CouponRow[] }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  const onToggle = (id: string, v: boolean) =>
    start(async () => {
      await toggleCoupon(id, v);
    });
  const onDelete = (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    start(async () => {
      const res = await deleteCoupon(id);
      toast[res.ok ? "success" : "error"](res.ok ? "Deleted" : res.error!);
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Coupons</h1>
          <p className="mt-1 text-sm text-muted-foreground">{coupons.length} coupons</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="size-4" /> New coupon</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create coupon</DialogTitle></DialogHeader>
            <CouponForm onDone={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {coupons.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
          <Ticket className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No coupons yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coupons.map((c) => (
            <div key={c.id} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-mono text-lg font-semibold">{c.code}</p>
                  <p className="text-xs text-muted-foreground">{c.description}</p>
                </div>
                <Switch checked={c.isActive} onCheckedChange={(v) => onToggle(c.id, v)} disabled={pending} />
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="secondary">
                  {c.type === "PERCENTAGE" ? `${c.value}% off` : c.type === "FLAT" ? `${formatPrice(c.value)} off` : "Free shipping"}
                </Badge>
                {c.minPurchase > 0 && <Badge variant="muted">Min {formatPrice(c.minPurchase)}</Badge>}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>
                  Used {c.usageCount}{c.usageLimit ? ` / ${c.usageLimit}` : ""}
                  {c.expiresAt ? ` · exp ${formatDate(c.expiresAt)}` : ""}
                </span>
                <button onClick={() => onDelete(c.id)} className="text-destructive hover:opacity-70">
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CouponForm({ onDone }: { onDone: () => void }) {
  const [form, setForm] = useState({
    code: "", description: "", type: "PERCENTAGE", value: "10",
    minPurchase: "0", usageLimit: "", expiresAt: "",
  });
  const [saving, setSaving] = useState(false);
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    const res = await createCoupon({
      ...form,
      value: Number(form.value),
      minPurchase: Number(form.minPurchase),
      usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
      expiresAt: form.expiresAt || undefined,
    });
    setSaving(false);
    if (res.ok) { toast.success("Coupon created"); onDone(); }
    else toast.error(res.error ?? "Failed");
  };

  return (
    <form onSubmit={submit} className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Code</Label>
        <Input value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="PULSE10" />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Description</Label>
        <Input value={form.description} onChange={(e) => set("description", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>Type</Label>
        <select value={form.type} onChange={(e) => set("type", e.target.value)} className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm">
          <option value="PERCENTAGE">Percentage</option>
          <option value="FLAT">Flat</option>
          <option value="FREE_SHIPPING">Free shipping</option>
        </select>
      </div>
      <div className="space-y-1.5">
        <Label>Value</Label>
        <Input type="number" value={form.value} onChange={(e) => set("value", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>Min purchase (₹)</Label>
        <Input type="number" value={form.minPurchase} onChange={(e) => set("minPurchase", e.target.value)} />
      </div>
      <div className="space-y-1.5">
        <Label>Usage limit</Label>
        <Input type="number" value={form.usageLimit} onChange={(e) => set("usageLimit", e.target.value)} placeholder="∞" />
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label>Expiry date</Label>
        <Input type="date" value={form.expiresAt} onChange={(e) => set("expiresAt", e.target.value)} />
      </div>
      <div className="sm:col-span-2">
        <Button type="submit" className="w-full" disabled={saving}>
          {saving && <Loader2 className="size-4 animate-spin" />} Create coupon
        </Button>
      </div>
    </form>
  );
}
