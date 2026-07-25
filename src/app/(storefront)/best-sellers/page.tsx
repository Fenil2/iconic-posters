import type { Metadata } from "next";
import { ProductListing } from "@/components/product/product-listing";
import { parseFilters } from "@/lib/filters";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Best Sellers",
  description: "The most-loved posters at PULSE — our top-selling wall art.",
  alternates: { canonical: "/best-sellers" },
};

export default async function BestSellersPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFilters(await searchParams, { sort: "bestselling" });
  return (
    <ProductListing
      filters={filters}
      title="Best Sellers"
      description="The prints our customers can’t stop framing."
      breadcrumb={[{ label: "Best Sellers", href: "/best-sellers" }]}
    />
  );
}
