import type { Metadata } from "next";
import { ProductListing } from "@/components/product/product-listing";
import { parseFilters } from "@/lib/filters";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop Premium Posters",
  description:
    "Discover posters that match your vibe. Browse hundreds of carefully curated movie, anime, gaming, car, music, aesthetic and minimal wall posters — premium printing, secure packaging, fast shipping across India.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFilters(await searchParams);
  return (
    <ProductListing
      filters={filters}
      title="Shop Premium Posters"
      description="Discover posters that match your vibe. Browse through hundreds of carefully curated designs across different categories."
      breadcrumb={[{ label: "Shop", href: "/shop" }]}
    />
  );
}
