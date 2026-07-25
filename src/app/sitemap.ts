import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { safe } from "@/server/queries/content";
import { getAllProductSlugs } from "@/server/queries/product-detail";
import { getAllCategorySlugs } from "@/server/queries/content";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url;

  const staticRoutes = [
    "",
    "/shop",
    "/new-arrivals",
    "/best-sellers",
    "/sale",
    "/blog",
    "/about",
    "/contact",
    "/faq",
    "/shipping",
    "/returns",
    "/privacy",
    "/terms",
  ].map((path) => ({
    url: `${base}${path}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.7,
  }));

  const [productSlugs, categorySlugs] = await Promise.all([
    safe(getAllProductSlugs, [] as string[]),
    safe(getAllCategorySlugs, [] as string[]),
  ]);

  const productRoutes = productSlugs.map((slug) => ({
    url: `${base}/product/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const categoryRoutes = categorySlugs.map((slug) => ({
    url: `${base}/category/${slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.9,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
