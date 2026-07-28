import type { Metadata } from "next";
import Link from "next/link";
import { getAdminOrders } from "@/server/queries/admin";
import { safe } from "@/server/queries/content";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/product/pagination";
import { formatPrice, formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Orders · Admin", robots: { index: false } };

const STATUSES = ["ALL", "PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];
const statusVariant: Record<string, "success" | "muted" | "accent" | "destructive"> = {
  DELIVERED: "success", SHIPPED: "accent", CANCELLED: "destructive", REFUNDED: "destructive",
};

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const status = sp.status ?? "ALL";
  const { orders, total, pageCount } = await safe(
    () => getAdminOrders({ status, page: Number(sp.page ?? 1) }),
    { orders: [], total: 0, pageCount: 1 },
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Orders</h1>
        <p className="mt-1 text-sm text-muted-foreground">{total} orders</p>
      </div>

      {/* Status tabs */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto">
        {STATUSES.map((s) => (
          <Link
            key={s}
            href={s === "ALL" ? "/admin/orders" : `/admin/orders?status=${s}`}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              status === s ? "border-primary bg-primary text-primary-foreground" : "border-border hover:bg-secondary",
            )}
          >
            {s.charAt(0) + s.slice(1).toLowerCase()}
          </Link>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Payment</th>
                <th className="p-4 font-medium">Total</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {orders.length === 0 && (
                <tr><td colSpan={6} className="p-12 text-center text-sm text-muted-foreground">No orders found.</td></tr>
              )}
              {orders.map((o) => (
                <tr key={o.id} className="cursor-pointer hover:bg-secondary/30">
                  <td className="p-4">
                    <Link href={`/admin/orders/${o.orderNumber}`} className="font-medium hover:underline">
                      {o.orderNumber}
                    </Link>
                  </td>
                  <td className="p-4 text-muted-foreground">{o.user.name ?? o.user.email}</td>
                  <td className="p-4 text-muted-foreground">{formatDate(o.createdAt)}</td>
                  <td className="p-4">
                    <Badge variant={o.paymentStatus === "PAID" ? "success" : "muted"}>
                      {o.paymentMethod}
                    </Badge>
                  </td>
                  <td className="p-4 font-medium">{formatPrice(Number(o.total))}</td>
                  <td className="p-4">
                    <Badge variant={statusVariant[o.status] ?? "muted"}>{o.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination page={Number(sp.page ?? 1)} pageCount={pageCount} />
    </div>
  );
}
