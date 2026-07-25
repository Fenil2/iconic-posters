import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
} from "lucide-react";
import { getAdminDashboard } from "@/server/queries/admin";
import { safe } from "@/server/queries/content";
import { RevenueChart } from "@/components/admin/revenue-chart";
import { Badge } from "@/components/ui/badge";
import { formatPrice, formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Admin Dashboard", robots: { index: false } };

const EMPTY = {
  revenue: 0, monthRevenue: 0, orderCount: 0, monthOrders: 0, customerCount: 0,
  productCount: 0, pendingCount: 0, lowStock: 0, aov: 0, trend: [], recentOrders: [], topProducts: [],
};

export default async function AdminDashboard() {
  const data = await safe(getAdminDashboard, EMPTY);

  const kpis = [
    { label: "Total revenue", value: formatPrice(data.revenue), sub: `${formatPrice(data.monthRevenue)} this month`, icon: IndianRupee },
    { label: "Orders", value: data.orderCount, sub: `${data.monthOrders} this month`, icon: ShoppingCart },
    { label: "Customers", value: data.customerCount, sub: "registered", icon: Users },
    { label: "Avg. order value", value: formatPrice(data.aov), sub: "all time", icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Store performance at a glance.</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{label}</span>
              <Icon className="size-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-semibold">{value}</p>
            <p className="text-xs text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/admin/orders?status=PENDING" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/40">
          <span className="grid size-10 place-items-center rounded-full bg-[var(--warning)]/15 text-[var(--warning)]">
            <ShoppingCart className="size-5" />
          </span>
          <div>
            <p className="font-medium">{data.pendingCount} orders need attention</p>
            <p className="text-xs text-muted-foreground">Pending & confirmed orders to process</p>
          </div>
          <ArrowRight className="ml-auto size-4 text-muted-foreground" />
        </Link>
        <Link href="/admin/products" className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary/40">
          <span className="grid size-10 place-items-center rounded-full bg-destructive/15 text-destructive">
            <AlertTriangle className="size-5" />
          </span>
          <div>
            <p className="font-medium">{data.lowStock} low-stock variants</p>
            <p className="text-xs text-muted-foreground">5 or fewer units remaining</p>
          </div>
          <ArrowRight className="ml-auto size-4 text-muted-foreground" />
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Revenue chart */}
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h2 className="font-semibold">Revenue</h2>
              <p className="text-xs text-muted-foreground">Last 14 days</p>
            </div>
            <Package className="size-4 text-muted-foreground" />
          </div>
          {data.trend.length > 0 ? (
            <RevenueChart data={data.trend} />
          ) : (
            <p className="py-16 text-center text-sm text-muted-foreground">No data yet.</p>
          )}
        </div>

        {/* Top products */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h2 className="mb-4 font-semibold">Top products</h2>
          <div className="space-y-3">
            {data.topProducts.length === 0 && (
              <p className="text-sm text-muted-foreground">No sales yet.</p>
            )}
            {data.topProducts.map((p, i) => (
              <div key={p.id} className="flex items-center gap-3">
                <span className="w-4 text-sm font-semibold text-muted-foreground">{i + 1}</span>
                <div className="relative size-10 overflow-hidden rounded-md bg-secondary">
                  {p.image && <Image src={p.image} alt={p.name} fill sizes="40px" className="object-cover" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-xs text-muted-foreground">{p.soldCount} sold</p>
                </div>
                <span className="text-sm font-medium">{formatPrice(p.price)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="rounded-xl border border-border bg-card">
        <div className="flex items-center justify-between border-b p-5">
          <h2 className="font-semibold">Recent orders</h2>
          <Link href="/admin/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="divide-y divide-border">
          {data.recentOrders.length === 0 && (
            <p className="p-5 text-sm text-muted-foreground">No orders yet.</p>
          )}
          {data.recentOrders.map((o) => (
            <Link
              key={o.id}
              href={`/admin/orders/${o.orderNumber}`}
              className="flex items-center justify-between p-4 transition-colors hover:bg-secondary/40"
            >
              <div>
                <p className="text-sm font-medium">{o.orderNumber}</p>
                <p className="text-xs text-muted-foreground">
                  {o.user.name ?? o.user.email} · {formatDate(o.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={o.status === "DELIVERED" ? "success" : "muted"}>{o.status}</Badge>
                <span className="text-sm font-semibold">{formatPrice(Number(o.total))}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
