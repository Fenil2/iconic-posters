import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Plus, Package, Search } from "@/components/icons";
import { getAdminProducts } from "@/server/queries/admin";
import { safe } from "@/server/queries/content";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Pagination } from "@/components/product/pagination";
import { ProductRowActions } from "@/components/admin/product-row-actions";
import { formatPrice } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Products · Admin", robots: { index: false } };

const statusVariant: Record<string, "success" | "muted" | "destructive"> = {
  ACTIVE: "success",
  DRAFT: "muted",
  ARCHIVED: "destructive",
};

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const { products, total, pageCount } = await safe(
    () => getAdminProducts({ q: sp.q, page: Number(sp.page ?? 1) }),
    { products: [], total: 0, pageCount: 1 },
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl font-semibold tracking-tight">Products</h1>
          <p className="mt-1 text-sm text-muted-foreground">{total} products</p>
        </div>
        <Button asChild>
          <Link href="/admin/products/new">
            <Plus className="size-4" /> Add product
          </Link>
        </Button>
      </div>

      <form className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input name="q" defaultValue={sp.q} placeholder="Search by name or SKU…" className="pl-9" />
      </form>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Product</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Stock</th>
                <th className="p-4 font-medium">Sold</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {products.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <Package className="mx-auto size-8 text-muted-foreground" />
                    <p className="mt-2 text-sm text-muted-foreground">No products yet.</p>
                    <Button asChild className="mt-4">
                      <Link href="/admin/products/new">Add your first product</Link>
                    </Button>
                  </td>
                </tr>
              )}
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative size-11 shrink-0 overflow-hidden rounded-md bg-secondary">
                        {p.image && <Image src={p.image} alt={p.name} fill sizes="44px" className="object-cover" />}
                      </div>
                      <div className="min-w-0">
                        <p className="truncate font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{p.category ?? "—"}</td>
                  <td className="p-4 font-medium">{formatPrice(p.price)}</td>
                  <td className="p-4">
                    <span className={p.stock <= 5 ? "font-medium text-destructive" : ""}>{p.stock}</span>
                  </td>
                  <td className="p-4 text-muted-foreground">{p.soldCount}</td>
                  <td className="p-4">
                    <Badge variant={statusVariant[p.status] ?? "muted"}>{p.status}</Badge>
                  </td>
                  <td className="p-4 text-right">
                    <ProductRowActions id={p.id} slug={p.slug} />
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
