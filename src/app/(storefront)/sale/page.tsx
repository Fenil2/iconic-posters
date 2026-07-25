import type { Metadata } from "next";
import { ProductListing } from "@/components/product/product-listing";
import { parseFilters } from "@/lib/filters";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sale",
  description: "Limited-time poster deals at Iconik Posters. Grab collector prints for less.",
  alternates: { canonical: "/sale" },
};

export default async function SalePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const filters = parseFilters(await searchParams, { onSale: true });
  return (
    <ProductListing
      filters={filters}
      title="Sale"
      description="Collector prints at reduced prices — while stocks last."
      breadcrumb={[{ label: "Sale", href: "/sale" }]}
    />
  );
}
