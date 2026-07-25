import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCategoriesForSelect } from "@/server/queries/admin";
import { safe } from "@/server/queries/content";
import { ProductForm } from "@/components/admin/product-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New Product · Admin", robots: { index: false } };

export default async function NewProductPage() {
  const categories = await safe(getCategoriesForSelect, []);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to products
        </Link>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">New Product</h1>
      </div>
      <ProductForm categories={categories} />
    </div>
  );
}
