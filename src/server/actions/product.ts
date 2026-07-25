"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";
import { productSchema, type ProductFormInput } from "@/lib/validations/product";
import { slugify } from "@/lib/utils";

export interface ProductActionResult {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  productId?: string;
}

function validate(input: ProductFormInput) {
  const parsed = productSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) fieldErrors[issue.path.join(".")] = issue.message;
    return { ok: false as const, fieldErrors };
  }
  return { ok: true as const, data: parsed.data };
}

/** Create a product with images, variants and a category link. */
export async function createProduct(input: ProductFormInput): Promise<ProductActionResult> {
  await requireAdmin();
  const res = validate(input);
  if (!res.ok) return { ok: false, error: "Please fix the errors", fieldErrors: res.fieldErrors };
  const d = res.data;
  const slug = (d.slug && slugify(d.slug)) || slugify(d.name);

  const clash = await prisma.product.findFirst({
    where: { OR: [{ slug }, { sku: d.sku }] },
  });
  if (clash) {
    return {
      ok: false,
      error: "A product with this slug or SKU already exists",
      fieldErrors: clash.slug === slug ? { slug: "Slug in use" } : { sku: "SKU in use" },
    };
  }

  const product = await prisma.product.create({
    data: {
      name: d.name,
      slug,
      sku: d.sku,
      description: d.description,
      shortDescription: d.shortDescription || null,
      basePrice: d.basePrice,
      mrp: d.mrp,
      taxRate: d.taxRate,
      orientation: d.orientation,
      status: d.status,
      theme: d.theme || null,
      color: d.color || null,
      artist: d.artist || null,
      brand: d.brand || "Iconik Posters",
      isFeatured: d.isFeatured,
      isBestSeller: d.isBestSeller,
      isNewArrival: d.isNewArrival,
      isTrending: d.isTrending,
      isLimitedEdition: d.isLimitedEdition,
      metaTitle: d.metaTitle || null,
      metaDescription: d.metaDescription || null,
      images: {
        create: d.images.map((img, i) => ({
          url: img.url,
          alt: img.alt || d.name,
          position: i,
          isPrimary: i === 0,
        })),
      },
      variants: {
        create: d.variants.map((v, i) => ({
          sku: v.sku || `${d.sku}-${v.size}-${v.frameType === "None" ? "N" : "F"}-${i}`.toUpperCase(),
          size: v.size,
          paperType: v.paperType,
          frameType: v.frameType,
          price: v.price,
          mrp: v.mrp,
          stock: v.stock,
          isDefault: i === 0,
        })),
      },
      categories: { create: [{ categoryId: d.categoryId }] },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/");
  return { ok: true, productId: product.id };
}

/** Update a product; images/variants are replaced wholesale. */
export async function updateProduct(
  id: string,
  input: ProductFormInput,
): Promise<ProductActionResult> {
  await requireAdmin();
  const res = validate(input);
  if (!res.ok) return { ok: false, error: "Please fix the errors", fieldErrors: res.fieldErrors };
  const d = res.data;
  const slug = (d.slug && slugify(d.slug)) || slugify(d.name);

  const clash = await prisma.product.findFirst({
    where: { OR: [{ slug }, { sku: d.sku }], NOT: { id } },
  });
  if (clash) return { ok: false, error: "Another product uses this slug or SKU" };

  await prisma.$transaction(async (tx) => {
    await tx.productImage.deleteMany({ where: { productId: id } });
    await tx.productVariant.deleteMany({ where: { productId: id } });
    await tx.productCategory.deleteMany({ where: { productId: id } });

    await tx.product.update({
      where: { id },
      data: {
        name: d.name,
        slug,
        sku: d.sku,
        description: d.description,
        shortDescription: d.shortDescription || null,
        basePrice: d.basePrice,
        mrp: d.mrp,
        taxRate: d.taxRate,
        orientation: d.orientation,
        status: d.status,
        theme: d.theme || null,
        color: d.color || null,
        artist: d.artist || null,
        brand: d.brand || "Iconik Posters",
        isFeatured: d.isFeatured,
        isBestSeller: d.isBestSeller,
        isNewArrival: d.isNewArrival,
        isTrending: d.isTrending,
        isLimitedEdition: d.isLimitedEdition,
        metaTitle: d.metaTitle || null,
        metaDescription: d.metaDescription || null,
        images: {
          create: d.images.map((img, i) => ({
            url: img.url,
            alt: img.alt || d.name,
            position: i,
            isPrimary: i === 0,
          })),
        },
        variants: {
          create: d.variants.map((v, i) => ({
            sku: v.sku || `${d.sku}-${v.size}-${v.frameType === "None" ? "N" : "F"}-${i}`.toUpperCase(),
            size: v.size,
            paperType: v.paperType,
            frameType: v.frameType,
            price: v.price,
            mrp: v.mrp,
            stock: v.stock,
            isDefault: i === 0,
          })),
        },
        categories: { create: [{ categoryId: d.categoryId }] },
      },
    });
  });

  revalidatePath("/admin/products");
  revalidatePath(`/product/${slug}`);
  return { ok: true, productId: id };
}

export async function deleteProduct(id: string): Promise<ProductActionResult> {
  await requireAdmin();
  await prisma.product.delete({ where: { id } });
  revalidatePath("/admin/products");
  return { ok: true };
}

export async function setProductStatus(
  id: string,
  status: "DRAFT" | "ACTIVE" | "ARCHIVED",
): Promise<ProductActionResult> {
  await requireAdmin();
  await prisma.product.update({ where: { id }, data: { status } });
  revalidatePath("/admin/products");
  return { ok: true };
}
