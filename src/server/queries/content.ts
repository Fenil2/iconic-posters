import "server-only";
import { prisma } from "@/lib/prisma";
import type { BannerData, CategoryCardData } from "@/types";

export async function getHeroBanners(): Promise<BannerData[]> {
  const rows = await prisma.banner.findMany({
    where: { position: "HERO", isActive: true },
    orderBy: { sortOrder: "asc" },
  });
  return rows.map((b) => ({
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    image: b.image,
    link: b.link,
    ctaLabel: b.ctaLabel,
  }));
}

export async function getFeaturedCategories(): Promise<CategoryCardData[]> {
  const rows = await prisma.category.findMany({
    where: { isActive: true, isFeatured: true },
    orderBy: { position: "asc" },
    take: 8,
  });
  return rows.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    image: c.image,
    icon: c.icon,
  }));
}

export async function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export async function getCollectionBySlug(slug: string) {
  return prisma.collection.findUnique({ where: { slug } });
}

export async function getAllCategorySlugs(): Promise<string[]> {
  const rows = await prisma.category.findMany({
    where: { isActive: true },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

/** Resilient wrapper: if the DB is unreachable, degrade gracefully to []. */
export async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn();
  } catch (err) {
    console.error("[query] falling back:", (err as Error).message);
    return fallback;
  }
}
