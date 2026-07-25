import type { Metadata } from "next";
import Link from "next/link";
import { Package, Truck, CheckCircle2, MapPin, ArrowRight } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { getAccountOverview } from "@/server/queries/account";
import { safe } from "@/server/queries/content";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My Account", robots: { index: false } };

export default async function AccountDashboard() {
  const user = await getCurrentUser();
  const data = await safe(() => getAccountOverview(user!.id), {
    orderCount: 0,
    addressCount: 0,
    pending: 0,
    delivered: 0,
    recentOrders: [],
    user: null,
  });

  const stats = [
    { label: "Total orders", value: data.orderCount, icon: Package },
    { label: "In transit", value: data.pending, icon: Truck },
    { label: "Delivered", value: data.delivered, icon: CheckCircle2 },
    { label: "Addresses", value: data.addressCount, icon: MapPin },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">
          Hi, {user?.name?.split(" ")[0] ?? "there"} 👋
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Here’s what’s happening with your account.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border p-5">
            <Icon className="size-5 text-muted-foreground" />
            <p className="mt-3 text-2xl font-semibold">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Recent orders</h2>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>

        {data.recentOrders.length === 0 ? (
          <div className="rounded-xl border border-dashed p-10 text-center">
            <p className="text-sm text-muted-foreground">No orders yet.</p>
            <Link
              href="/shop"
              className="mt-3 inline-block text-sm font-medium underline underline-offset-4"
            >
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {data.recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/order/${order.orderNumber}`}
                className="flex items-center justify-between rounded-xl border border-border p-4 transition-colors hover:bg-secondary/40"
              >
                <div>
                  <p className="text-sm font-medium">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(order.createdAt)} · {order.items.length} item(s)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={order.status === "DELIVERED" ? "success" : "muted"}>
                    {order.status}
                  </Badge>
                  <span className="text-sm font-semibold">
                    {formatPrice(Number(order.total))}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
