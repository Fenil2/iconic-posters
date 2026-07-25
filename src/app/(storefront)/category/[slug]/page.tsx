import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductListing } from "@/components/product/product-listing";
import { parseFilters } from "@/lib/filters";
import { megaMenu } from "@/config/navigation";
import { safe, getCategoryBySlug } from "@/server/queries/content";
import { siteConfig } from "@/config/site";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;
type Search = Promise<Record<string, string | string[] | undefined>>;

/** Resolve a friendly category name from config first, DB second. */
async function resolveCategory(slug: string) {
  const fromConfig = megaMenu.find((c) => c.slug === slug);
  if (fromConfig) return { name: fromConfig.label, slug };
  const fromDb = await safe(() => getCategoryBySlug(slug), null);
  return fromDb ? { name: fromDb.name, slug } : null;
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const cat = await resolveCategory(slug);
  if (!cat) return { title: "Category not found" };
  return {
    title: `${cat.name} Posters`,
    description: `Shop premium ${cat.name} posters at ${siteConfig.name}. High-quality printing, multiple sizes, framed and unframed options, fast shipping across India.`,
    alternates: { canonical: `/category/${slug}` },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const { slug } = await params;
  const cat = await resolveCategory(slug);
  if (!cat) notFound();

  const sp = await searchParams;
  const filters = parseFilters(sp, { category: slug });

  return (
    <ProductListing
      filters={filters}
      title={`${cat.name} Posters`}
      description={`Premium ${cat.name.toLowerCase()} wall posters — vibrant, fade-resistant prints in multiple sizes, framed or unframed.`}
      breadcrumb={[{ label: cat.name, href: `/category/${slug}` }]}
    />
  );
}
