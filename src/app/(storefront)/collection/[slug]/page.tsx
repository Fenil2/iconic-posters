import type { Metadata } from "next";
import { ProductListing } from "@/components/product/product-listing";
import { parseFilters } from "@/lib/filters";
import { safe, getCollectionBySlug } from "@/server/queries/content";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;
type Search = Promise<Record<string, string | string[] | undefined>>;

/** Title-case a slug as an offline fallback name. */
const titleize = (slug: string) =>
  slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

async function resolveName(slug: string) {
  const col = await safe(() => getCollectionBySlug(slug), null);
  return col?.name ?? titleize(slug);
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const name = await resolveName(slug);
  return {
    title: name,
    description: `Shop the ${name} collection at PULSE — curated premium posters.`,
    alternates: { canonical: `/collection/${slug}` },
  };
}

export default async function CollectionPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const { slug } = await params;
  const name = await resolveName(slug);
  const filters = parseFilters(await searchParams, { collection: slug });

  return (
    <ProductListing
      filters={filters}
      title={name}
      description={`A curated edit — the ${name} collection.`}
      breadcrumb={[{ label: name, href: `/collection/${slug}` }]}
    />
  );
}
