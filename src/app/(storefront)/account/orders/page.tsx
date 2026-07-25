import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Package } from "@/components/icons";
import { getCurrentUser } from "@/lib/auth";
import { getUserOrders } from "@/server/queries/orders";
import { safe } from "@/server/queries/content";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My Orders", robots: { index: false } };

const statusVariant: Record<string, "success" | "muted" | "accent" | "destructive"> = {
  DELIVERED: "success",
  SHIPPED: "accent",
  CANCELLED: "destructive",
  REFUNDED: "destructive",
};

export default async function OrdersPage() {
  const user = await getCurrentUser();
  const orders = await safe(() => getUserOrders(user!.id), []);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed py-24 text-center">
        <Package className="size-10 text-muted-foreground" />
        <div>
          <p className="font-medium">No orders yet</p>
          <p className="text-sm text-muted-foreground">
            When you place an order, it’ll show up here.
          </p>
        </div>
        <Button asChild>
          <Link href="/shop">Browse posters</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="rounded-xl border border-border p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
              <div className="flex flex-wrap gap-x-8 gap-y-1 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Order</p>
                  <p className="font-medium">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Placed</p>
                  <p className="font-medium">{formatDate(order.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total</p>
                  <p className="font-medium">{formatPrice(Number(order.total))}</p>
                </div>
              </div>
              <Badge variant={statusVariant[order.status] ?? "muted"}>
                {order.status}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
              <div className="flex -space-x-3">
                {order.items.map((item) =>
                  item.image ? (
                    <div
                      key={item.id}
                      className="relative size-14 overflow-hidden rounded-lg border-2 border-background bg-secondary"
                    >
                      <Image src={item.image} alt={item.name} fill sizes="56px" className="object-cover" />
                    </div>
                  ) : null,
                )}
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/order/${order.orderNumber}`}>View details</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/track-order?order=${order.orderNumber}`}>Track</Link>
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
