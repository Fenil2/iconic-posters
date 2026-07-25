import type { Metadata } from "next";
import Link from "next/link";
import { FileText, Download } from "@/components/icons";
import { getCurrentUser } from "@/lib/auth";
import { getUserOrders } from "@/server/queries/orders";
import { safe } from "@/server/queries/content";
import { Button } from "@/components/ui/button";
import { formatDate, formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Downloads", robots: { index: false } };

/** Invoices for paid orders (downloadable receipts). */
export default async function DownloadsPage() {
  const user = await getCurrentUser();
  const orders = await safe(() => getUserOrders(user!.id), []);
  const invoiceable = orders.filter(
    (o) => o.paymentStatus === "PAID" || o.paymentMethod === "COD",
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Downloads</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Invoices & receipts for your orders.
        </p>
      </div>

      {invoiceable.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
          <FileText className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">No invoices yet.</p>
        </div>
      ) : (
        <div className="divide-y divide-border rounded-xl border border-border">
          {invoiceable.map((o) => (
            <div key={o.id} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <FileText className="size-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Invoice · {o.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(o.createdAt)} · {formatPrice(Number(o.total))}
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/api/invoice/${o.orderNumber}`} target="_blank">
                  <Download className="size-4" /> Download
                </Link>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
