import "server-only";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { calcDiscountPercent } from "@/lib/utils";
import type { ProductCardData, ProductFilters, SortOption } from "@/types";

/** Standard include for card-level product queries. */
const cardInclude = {
  images: { orderBy: { position: "asc" }, take: 2 },
  variants: { select: { stock: true } },
} satisfies Prisma.ProductInclude;

type ProductWithCard = Prisma.ProductGetPayload<{ include: typeof cardInclude }>;

/** Map a Prisma product to the serializable card DTO. */
export function toCardData(p: ProductWithCard): ProductCardData {
  const price = Number(p.basePrice);
  const mrp = Number(p.mrp);
  const totalStock = p.variants.reduce((sum, v) => sum + v.stock, 0);
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    price,
    mrp,
    discountPercent: calcDiscountPercent(mrp, price),
    image: p.images[0]?.url ?? "/placeholder-poster.jpg",
    secondaryImage: p.images[1]?.url,
    artist: p.artist,
    theme: p.theme,
    orientation: p.orientation,
    ratingAverage: p.ratingAverage,
    ratingCount: p.ratingCount,
    isBestSeller: p.isBestSeller,
    isNewArrival: p.isNewArrival,
    isLimitedEdition: p.isLimitedEdition,
    inStock: totalStock > 0,
  };
}

const activeWhere: Prisma.ProductWhereInput = { status: "ACTIVE" };

export async function getFeaturedProducts(take = 8): Promise<ProductCardData[]> {
  const rows = await prisma.product.findMany({
    where: { ...activeWhere, isFeatured: true },
    include: cardInclude,
    take,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toCardData);
}

export async function getBestSellers(take = 8): Promise<ProductCardData[]> {
  const rows = await prisma.product.findMany({
    where: { ...activeWhere, isBestSeller: true },
    include: cardInclude,
    take,
    orderBy: { soldCount: "desc" },
  });
  return rows.map(toCardData);
}

export async function getNewArrivals(take = 8): Promise<ProductCardData[]> {
  const rows = await prisma.product.findMany({
    where: activeWhere,
    include: cardInclude,
    take,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toCardData);
}

export async function getTrending(take = 8): Promise<ProductCardData[]> {
  const rows = await prisma.product.findMany({
    where: { ...activeWhere, isTrending: true },
    include: cardInclude,
    take,
    orderBy: { viewCount: "desc" },
  });
  return rows.map(toCardData);
}

export async function getLimitedEdition(take = 8): Promise<ProductCardData[]> {
  const rows = await prisma.product.findMany({
    where: { ...activeWhere, isLimitedEdition: true },
    include: cardInclude,
    take,
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toCardData);
}

const sortMap: Record<SortOption, Prisma.ProductOrderByWithRelationInput> = {
  relevance: { isFeatured: "desc" },
  newest: { createdAt: "desc" },
  "price-asc": { basePrice: "asc" },
  "price-desc": { basePrice: "desc" },
  rating: { ratingAverage: "desc" },
  bestselling: { soldCount: "desc" },
};

export const PAGE_SIZE = 12;

/** Paginated, filtered listing used by category & search pages. */
export async function getProducts(filters: ProductFilters): Promise<{
  products: ProductCardData[];
  total: number;
  page: number;
  pageCount: number;
}> {
  const page = Math.max(1, filters.page ?? 1);

  const where: Prisma.ProductWhereInput = {
    ...activeWhere,
    ...(filters.category && filters.category !== "all"
      ? { categories: { some: { category: { slug: filters.category } } } }
      : {}),
    ...(filters.collection
      ? { collections: { some: { collection: { slug: filters.collection } } } }
      : {}),
    ...(filters.q
      ? {
          OR: [
            { name: { contains: filters.q, mode: "insensitive" } },
            { description: { contains: filters.q, mode: "insensitive" } },
            { artist: { contains: filters.q, mode: "insensitive" } },
            { theme: { contains: filters.q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(filters.theme?.length ? { theme: { in: filters.theme } } : {}),
    ...(filters.color?.length ? { color: { in: filters.color } } : {}),
    ...(filters.orientation?.length
      ? { orientation: { in: filters.orientation as Prisma.EnumOrientationFilter["in"] } }
      : {}),
    ...(filters.minRating ? { ratingAverage: { gte: filters.minRating } } : {}),
    // Price range + "on sale" (basePrice < mrp) combined via AND to avoid a
    // basePrice key collision when both are active.
    AND: [
      ...(filters.minPrice != null
        ? [{ basePrice: { gte: filters.minPrice } }]
        : []),
      ...(filters.maxPrice != null
        ? [{ basePrice: { lte: filters.maxPrice } }]
        : []),
      ...(filters.onSale
        ? [{ basePrice: { lt: prisma.product.fields.mrp } }]
        : []),
    ],
    ...(filters.size?.length || filters.frame?.length || filters.inStock
      ? {
          variants: {
            some: {
              ...(filters.size?.length ? { size: { in: filters.size } } : {}),
              ...(filters.frame?.length ? { frameType: { in: filters.frame } } : {}),
              ...(filters.inStock ? { stock: { gt: 0 } } : {}),
            },
          },
        }
      : {}),
  };

  const [total, rows] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: cardInclude,
      orderBy: sortMap[filters.sort ?? "relevance"],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);

  return {
    products: rows.map(toCardData),
    total,
    page,
    pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

export async function getRelatedProducts(
  productId: string,
  categorySlug: string | undefined,
  take = 6,
): Promise<ProductCardData[]> {
  const rows = await prisma.product.findMany({
    where: {
      ...activeWhere,
      id: { not: productId },
      ...(categorySlug
        ? { categories: { some: { category: { slug: categorySlug } } } }
        : {}),
    },
    include: cardInclude,
    take,
    orderBy: { soldCount: "desc" },
  });
  return rows.map(toCardData);
}
