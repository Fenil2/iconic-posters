"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

const schema = z.object({
  name: z.string().min(2).max(60),
  slug: z.string().optional(),
  description: z.string().optional().or(z.literal("")),
  image: z.string().url().optional().or(z.literal("")),
  icon: z.string().optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
});

export interface CategoryResult {
  ok: boolean;
  error?: string;
}

export async function createCategory(input: unknown): Promise<CategoryResult> {
  await requireAdmin();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const d = parsed.data;
  const slug = (d.slug && slugify(d.slug)) || slugify(d.name);

  const exists = await prisma.category.findUnique({ where: { slug } });
  if (exists) return { ok: false, error: "A category with this slug exists" };

  const count = await prisma.category.count();
  await prisma.category.create({
    data: {
      name: d.name,
      slug,
      description: d.description || null,
      image: d.image || null,
      icon: d.icon || null,
      isFeatured: d.isFeatured,
      position: count,
    },
  });
  revalidatePath("/admin/categories");
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<CategoryResult> {
  await requireAdmin();
  const linked = await prisma.productCategory.count({ where: { categoryId: id } });
  if (linked > 0) {
    return { ok: false, error: `Cannot delete — ${linked} product(s) use this category` };
  }
  await prisma.category.delete({ where: { id } });
  revalidatePath("/admin/categories");
  return { ok: true };
}

export async function toggleCategoryFeatured(id: string, isFeatured: boolean): Promise<CategoryResult> {
  await requireAdmin();
  await prisma.category.update({ where: { id }, data: { isFeatured } });
  revalidatePath("/admin/categories");
  return { ok: true };
}
