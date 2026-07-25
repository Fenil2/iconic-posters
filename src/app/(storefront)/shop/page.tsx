import type { Metadata } from "next";
import { ProductListing } from "@/components/product/product-listing";
import { parseFilters } from "@/lib/filters";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shop All Posters",
  description:
    "Browse the full PULSE collection — bikes, cars, heroes & heroines, nature and anime posters. Premium archival prints with framing options.",
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
      title="All Posters"
      description="The complete collection — every category, every drop."
      breadcrumb={[{ label: "Shop", href: "/shop" }]}
    />
  );
}
