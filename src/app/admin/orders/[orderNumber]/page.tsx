import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, Download } from "@/components/icons";
import { getAdminOrderDetail } from "@/server/queries/admin";
import { safe } from "@/server/queries/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { OrderStatusUpdater } from "@/components/admin/order-status-updater";
import { formatPrice, formatDate, timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Order · Admin", robots: { index: false } };

export default async function AdminOrderDetail({
  params,
}: {
  params: Promise<{ orderNumber: string }>;
}) {
  const { orderNumber } = await params;
  const order = await safe(() => getAdminOrderDetail(orderNumber), null);
  if (!order) notFound();

  const addr = order.shippingSnapshot as Record<string, string> | null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/admin/orders" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" /> Back to orders
          </Link>
          <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">{order.orderNumber}</h1>
          <p className="text-sm text-muted-foreground">Placed {formatDate(order.createdAt)}</p>
        </div>
        <Button variant="outline" asChild>
          <Link href={`/api/invoice/${order.orderNumber}`} target="_blank">
            <Download className="size-4" /> Invoice
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        <div className="space-y-6">
          {/* Items */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-semibold">Items</h3>
            <ul className="space-y-4">
              {order.items.map((i) => (
                <li key={i.id} className="flex gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                    {i.image && <Image src={i.image} alt={i.name} fill sizes="64px" className="object-cover" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{i.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {[i.size, i.paperType, i.frameType].filter(Boolean).join(" · ")} · Qty {i.quantity}
                    </p>
                  </div>
                  <span className="text-sm font-medium">{formatPrice(Number(i.total))}</span>
                </li>
              ))}
            </ul>
            <Separator className="my-4" />
            <div className="ml-auto max-w-xs space-y-1.5 text-sm">
              <Row label="Subtotal" value={formatPrice(Number(order.subtotal))} />
              {Number(order.discount) > 0 && <Row label="Discount" value={`− ${formatPrice(Number(order.discount))}`} />}
              <Row label="Shipping" value={Number(order.shippingFee) === 0 ? "Free" : formatPrice(Number(order.shippingFee))} />
              <div className="flex justify-between pt-1 font-semibold">
                <span>Total</span><span>{formatPrice(Number(order.total))}</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-xl border border-border bg-card p-5">
            <h3 className="mb-4 font-semibold">Timeline</h3>
            <ol className="space-y-4">
              {order.timeline.map((t) => (
                <li key={t.id} className="flex gap-3">
                  <div className="mt-1 size-2.5 shrink-0 rounded-full bg-primary" />
                  <div>
                    <p className="text-sm font-medium">{t.status}</p>
                    {t.note && <p className="text-xs text-muted-foreground">{t.note}</p>}
                    <p className="text-xs text-muted-foreground">{timeAgo(t.createdAt)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <OrderStatusUpdater
            orderNumber={order.orderNumber}
            current={order.status}
            courier={order.courier}
            trackingNumber={order.trackingNumber}
          />

          <div className="rounded-xl border border-border bg-card p-5 text-sm">
            <h3 className="mb-3 font-semibold">Customer</h3>
            <p className="font-medium">{order.user.name ?? "—"}</p>
            <p className="text-muted-foreground">{order.user.email}</p>
            {order.user.phone && <p className="text-muted-foreground">{order.user.phone}</p>}
            <div className="mt-3 flex gap-2">
              <Badge variant={order.paymentStatus === "PAID" ? "success" : "muted"}>
                {order.paymentMethod} · {order.paymentStatus}
              </Badge>
            </div>
          </div>

          {addr && (
            <div className="rounded-xl border border-border bg-card p-5 text-sm">
              <h3 className="mb-2 font-semibold">Shipping address</h3>
              <p className="text-muted-foreground">
                {addr.fullName}<br />
                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ""}<br />
                {addr.city}, {addr.state} {addr.pincode}<br />
                📞 {addr.phone}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span>{value}</span>
    </div>
  );
}
