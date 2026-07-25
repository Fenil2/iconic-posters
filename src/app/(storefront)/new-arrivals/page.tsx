import type { Metadata } from "next";
import { ProductListing } from "@/components/product/product-listing";
import { parseFilters } from "@/lib/filters";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "The latest poster drops at PULSE — fresh wall art, just added.",
  alternates: { canonical: "/new-arrivals" },
};

export default async function NewArrivalsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFilters(await searchParams, { sort: "newest" });
  return (
    <ProductListing
      filters={filters}
      title="New Arrivals"
      description="Fresh off the press — the newest additions to the collection."
      breadcrumb={[{ label: "New Arrivals", href: "/new-arrivals" }]}
    />
  );
}
