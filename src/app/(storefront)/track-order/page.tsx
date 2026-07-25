"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { PackageSearch } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function TrackForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [order, setOrder] = useState(params.get("order") ?? "");

  return (
    <div className="mx-auto max-w-md px-4 py-20">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="grid size-16 place-items-center rounded-full bg-secondary">
          <PackageSearch className="size-7" />
        </div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Track your order</h1>
        <p className="text-sm text-muted-foreground">
          Enter your order number to see its latest status.
        </p>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (order.trim()) router.push(`/order/${order.trim()}`);
        }}
        className="mt-8 space-y-4"
      >
        <div className="space-y-1.5">
          <Label>Order number</Label>
          <Input
            value={order}
            onChange={(e) => setOrder(e.target.value.toUpperCase())}
            placeholder="PLS-XXXX-XXXX"
          />
        </div>
        <Button type="submit" size="lg" className="w-full">
          Track order
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          You’ll need to be signed in to the account that placed the order.
        </p>
      </form>
    </div>
  );
}

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="h-96" />}>
      <TrackForm />
    </Suspense>
  );
}
