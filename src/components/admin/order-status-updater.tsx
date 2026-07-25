"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateOrderStatus } from "@/server/actions/admin-order";

const STATUSES = [
  "PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED", "REFUNDED",
] as const;

export function OrderStatusUpdater({
  orderNumber,
  current,
  courier,
  trackingNumber,
}: {
  orderNumber: string;
  current: string;
  courier?: string | null;
  trackingNumber?: string | null;
}) {
  const [status, setStatus] = useState(current);
  const [ct, setCt] = useState(courier ?? "");
  const [tn, setTn] = useState(trackingNumber ?? "");
  const [pending, start] = useTransition();

  const save = () =>
    start(async () => {
      const res = await updateOrderStatus(
        orderNumber,
        status as (typeof STATUSES)[number],
        undefined,
        { courier: ct, trackingNumber: tn },
      );
      toast[res.ok ? "success" : "error"](res.ok ? "Order updated" : res.error ?? "Failed");
    });

  return (
    <div className="space-y-4 rounded-xl border border-border bg-card p-5">
      <h3 className="font-semibold">Update order</h3>
      <div className="space-y-1.5">
        <Label>Status</Label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="h-11 w-full rounded-md border border-input bg-background px-3 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label>Courier</Label>
          <Input value={ct} onChange={(e) => setCt(e.target.value)} placeholder="Delhivery" />
        </div>
        <div className="space-y-1.5">
          <Label>Tracking #</Label>
          <Input value={tn} onChange={(e) => setTn(e.target.value)} placeholder="AWB…" />
        </div>
      </div>
      <Button className="w-full" onClick={save} disabled={pending}>
        {pending && <Loader2 className="size-4 animate-spin" />}
        Save changes
      </Button>
    </div>
  );
}
