import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { getCategoriesForSelect, getAdminProductForEdit } from "@/server/queries/admin";
import { safe } from "@/server/queries/content";
import { ProductForm } from "@/components/admin/product-form";
import type { ProductFormInput } from "@/lib/validations/product";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Edit Product · Admin", robots: { index: false } };

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [categories, data] = await Promise.all([
    safe(getCategoriesForSelect, []),
    safe(() => getAdminProductForEdit(id), null),
  ]);
  if (!data) notFound();

  return (
    <div className="space-y-6">
      <div>
        <Link href="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="size-4" /> Back to products
        </Link>
        <h1 className="mt-2 font-serif text-3xl font-semibold tracking-tight">Edit Product</h1>
      </div>
      <ProductForm
        categories={categories}
        productId={data.id}
        initial={data.initial as Partial<ProductFormInput>}
      />
    </div>
  );
}
