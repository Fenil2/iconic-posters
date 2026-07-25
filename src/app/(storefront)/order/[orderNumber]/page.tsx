import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2, Clock, Package, Truck, Home, XCircle } from "lucide-react";
import { getOrderByNumber } from "@/server/queries/orders";
import { getCurrentUser } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order Confirmation", robots: { index: false } };

const STEPS = [
  { status: "PENDING", label: "Placed", icon: Clock },
  { status: "CONFIRMED", label: "Confirmed", icon: CheckCircle2 },
  { status: "PACKED", label: "Packed", icon: Package },
  { status: "SHIPPED", label: "Shipped", icon: Truck },
  { status: "DELIVERED", label: "Delivered", icon: Home },
];

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ orderNumber: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login");

  const { orderNumber } = await params;
  const { status } = await searchParams;
  const order = await getOrderByNumber(orderNumber, user.id);
  if (!order) notFound();

  const failed = status === "failed" || order.paymentStatus === "FAILED";
  const currentStep = STEPS.findIndex((s) => s.status === order.status);
  const addr = order.shippingSnapshot as Record<string, string> | null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      {/* Header */}
      <div className="flex flex-col items-center text-center">
        {failed ? (
          <>
            <XCircle className="size-16 text-destructive" />
            <h1 className="mt-4 font-serif text-3xl font-semibold">Payment Failed</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your order <span className="font-medium">{order.orderNumber}</span> is
              awaiting payment. You can retry from your orders.
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 className="size-16 text-[var(--success)]" />
            <h1 className="mt-4 font-serif text-3xl font-semibold">Thank you!</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your order <span className="font-medium">{order.orderNumber}</span> is
              confirmed. A receipt has been sent to your email.
            </p>
          </>
        )}
      </div>

      {/* Timeline */}
      {!failed && (
        <div className="mt-10 flex items-center justify-between">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            const done = i <= currentStep;
            return (
              <div key={step.status} className="flex flex-1 flex-col items-center">
                <div className="flex w-full items-center">
                  <div className={`h-0.5 flex-1 ${i === 0 ? "opacity-0" : done ? "bg-primary" : "bg-border"}`} />
                  <div
                    className={`grid size-10 shrink-0 place-items-center rounded-full border-2 ${
                      done
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground"
                    }`}
                  >
                    <Icon className="size-4" />
                  </div>
                  <div className={`h-0.5 flex-1 ${i === STEPS.length - 1 ? "opacity-0" : i < currentStep ? "bg-primary" : "bg-border"}`} />
                </div>
                <span className="mt-2 text-[11px] text-muted-foreground">{step.label}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Details */}
      <div className="mt-10 space-y-6 rounded-xl border border-border p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm text-muted-foreground">Order date</p>
            <p className="font-medium">{formatDate(order.createdAt)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Payment</p>
            <Badge variant={order.paymentStatus === "PAID" ? "success" : "muted"}>
              {order.paymentMethod} · {order.paymentStatus}
            </Badge>
          </div>
        </div>

        <Separator />

        <ul className="space-y-4">
          {order.items.map((item) => (
            <li key={item.id} className="flex gap-4">
              <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                {item.image && (
                  <Image src={item.image} alt={item.name} fill sizes="64px" className="object-cover" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{item.name}</p>
                <p className="text-xs text-muted-foreground">
                  {[item.size, item.paperType, item.frameType].filter(Boolean).join(" · ")}
                </p>
                <p className="text-xs text-muted-foreground">Qty {item.quantity}</p>
              </div>
              <span className="text-sm font-medium">{formatPrice(Number(item.total))}</span>
            </li>
          ))}
        </ul>

        <Separator />

        <div className="space-y-1.5 text-sm">
          <Row label="Subtotal" value={formatPrice(Number(order.subtotal))} />
          {Number(order.discount) > 0 && (
            <Row label="Discount" value={`− ${formatPrice(Number(order.discount))}`} />
          )}
          <Row
            label="Shipping"
            value={Number(order.shippingFee) === 0 ? "Free" : formatPrice(Number(order.shippingFee))}
          />
          {Number(order.giftWrapFee) > 0 && (
            <Row label="Gift wrap" value={formatPrice(Number(order.giftWrapFee))} />
          )}
          <div className="flex items-center justify-between pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>

        {addr && (
          <>
            <Separator />
            <div className="text-sm">
              <p className="font-medium">Shipping to</p>
              <p className="text-muted-foreground">
                {addr.fullName}, {addr.line1}
                {addr.line2 ? `, ${addr.line2}` : ""}, {addr.city}, {addr.state} {addr.pincode}
              </p>
              <p className="text-muted-foreground">Phone: {addr.phone}</p>
            </div>
          </>
        )}
      </div>

      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Button asChild>
          <Link href="/account/orders">View my orders</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/shop">Continue shopping</Link>
        </Button>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
