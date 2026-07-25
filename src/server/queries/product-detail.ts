import "server-only";
import { prisma } from "@/lib/prisma";
import { calcDiscountPercent } from "@/lib/utils";
import type { ProductDetailData, ReviewData } from "@/types";

/** Full product detail with variants, images, category and recent reviews. */
export async function getProductBySlug(
  slug: string,
): Promise<ProductDetailData | null> {
  const p = await prisma.product.findUnique({
    where: { slug },
    include: {
      images: { orderBy: { position: "asc" } },
      variants: {
        where: { isActive: true },
        orderBy: [{ isDefault: "desc" }, { price: "asc" }],
      },
      categories: { include: { category: true }, take: 1 },
      reviews: {
        where: { isApproved: true },
        include: { user: { select: { name: true, image: true } } },
        orderBy: [{ likeCount: "desc" }, { createdAt: "desc" }],
        take: 8,
      },
    },
  });

  if (!p || p.status !== "ACTIVE") return null;

  const price = Number(p.basePrice);
  const mrp = Number(p.mrp);
  const cat = p.categories[0]?.category;

  // Rating histogram
  const ratingBreakdown = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 } as Record<
    1 | 2 | 3 | 4 | 5,
    number
  >;
  const grouped = await prisma.review.groupBy({
    by: ["rating"],
    where: { productId: p.id, isApproved: true },
    _count: true,
  });
  for (const g of grouped) {
    const r = g.rating as 1 | 2 | 3 | 4 | 5;
    if (r >= 1 && r <= 5) ratingBreakdown[r] = g._count;
  }

  const reviews: ReviewData[] = p.reviews.map((r) => ({
    id: r.id,
    author: r.user.name ?? "PULSE Customer",
    avatar: r.user.image,
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    images: r.images,
    isVerified: r.isVerified,
    likeCount: r.likeCount,
    adminReply: r.adminReply,
    createdAt: r.createdAt.toISOString(),
  }));

  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    sku: p.sku,
    description: p.description,
    shortDescription: p.shortDescription,
    basePrice: price,
    mrp,
    discountPercent: calcDiscountPercent(mrp, price),
    taxRate: Number(p.taxRate),
    orientation: p.orientation,
    theme: p.theme,
    color: p.color,
    artist: p.artist,
    brand: p.brand,
    ratingAverage: p.ratingAverage,
    ratingCount: p.ratingCount,
    soldCount: p.soldCount,
    isLimitedEdition: p.isLimitedEdition,
    isBestSeller: p.isBestSeller,
    category: cat ? { name: cat.name, slug: cat.slug } : null,
    images: p.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt ?? p.name,
    })),
    variants: p.variants.map((v) => ({
      id: v.id,
      sku: v.sku,
      size: v.size,
      paperType: v.paperType,
      frameType: v.frameType,
      price: Number(v.price),
      mrp: Number(v.mrp),
      stock: v.stock,
      isDefault: v.isDefault,
    })),
    ratingBreakdown,
    reviews,
  };
}

/** Increment view counter (fire-and-forget from the page). */
export async function trackProductView(productId: string): Promise<void> {
  await prisma.product
    .update({ where: { id: productId }, data: { viewCount: { increment: 1 } } })
    .catch(() => {});
}

export async function getAllProductSlugs(): Promise<string[]> {
  const rows = await prisma.product.findMany({
    where: { status: "ACTIVE" },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}
