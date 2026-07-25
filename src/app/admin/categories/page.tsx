import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { safe } from "@/server/queries/content";
import { CategoryManager, type CategoryRow } from "@/components/admin/category-manager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Categories · Admin", robots: { index: false } };

export default async function AdminCategoriesPage() {
  const rows = await safe(
    () =>
      prisma.category.findMany({
        orderBy: { position: "asc" },
        include: { _count: { select: { products: true } } },
      }),
    [],
  );

  const categories: CategoryRow[] = rows.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image,
    isFeatured: c.isFeatured,
    productCount: c._count.products,
  }));

  return <CategoryManager categories={categories} />;
}
