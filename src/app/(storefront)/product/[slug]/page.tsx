import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductGallery } from "@/components/product/product-gallery";
import { ProductPurchase } from "@/components/product/product-purchase";
import { ProductTabs } from "@/components/product/product-tabs";
import { ProductRail } from "@/components/product/product-rail";
import { RecentlyViewedTracker } from "@/components/product/recently-viewed-tracker";
import { JsonLd } from "@/components/shared/json-ld";
import { getProductBySlug } from "@/server/queries/product-detail";
import { getRelatedProducts } from "@/server/queries/products";
import { safe } from "@/server/queries/content";
import { siteConfig } from "@/config/site";
import type { ProductCardData } from "@/types";

export const dynamic = "force-dynamic";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await safe(() => getProductBySlug(slug), null);
  if (!product) return { title: "Product not found" };

  const title = `${product.name}${product.category ? ` — ${product.category.name} Poster` : ""}`;
  return {
    title,
    description:
      product.shortDescription ??
      `Buy ${product.name} at ${siteConfig.name}. Premium archival print, multiple sizes & framing.`,
    alternates: { canonical: `/product/${slug}` },
    openGraph: {
      title,
      images: product.images[0] ? [{ url: product.images[0].url }] : [],
      type: "website",
    },
  };
}

export default async function ProductPage({ params }: { params: Params }) {
  const { slug } = await params;
  const product = await safe(() => getProductBySlug(slug), null);
  if (!product) notFound();

  const related = await safe(
    () => getRelatedProducts(product.id, product.category?.slug, 10),
    [] as ProductCardData[],
  );

  const cardForTracking: ProductCardData = {
    id: product.id,
    name: product.name,
    slug: product.slug,
    price: product.basePrice,
    mrp: product.mrp,
    discountPercent: product.discountPercent,
    image: product.images[0]?.url ?? "/placeholder-poster.jpg",
    artist: product.artist,
    theme: product.theme,
    orientation: product.orientation,
    ratingAverage: product.ratingAverage,
    ratingCount: product.ratingCount,
    isBestSeller: product.isBestSeller,
    isNewArrival: false,
    isLimitedEdition: product.isLimitedEdition,
    inStock: product.variants.some((v) => v.stock > 0),
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    image: product.images.map((i) => i.url),
    description: product.shortDescription ?? product.description,
    sku: product.sku,
    brand: { "@type": "Brand", name: product.brand ?? "PULSE" },
    aggregateRating:
      product.ratingCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.ratingAverage,
            reviewCount: product.ratingCount,
          }
        : undefined,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: product.basePrice,
      availability: cardForTracking.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteConfig.url}/product/${product.slug}`,
    },
  };

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-8">
      <JsonLd data={jsonLd} />
      <RecentlyViewedTracker product={cardForTracking} />

      {/* Breadcrumb */}
      <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link href="/" className="hover:text-foreground">Home</Link>
        <span>/</span>
        {product.category && (
          <>
            <Link href={`/category/${product.category.slug}`} className="hover:text-foreground">
              {product.category.name}
            </Link>
            <span>/</span>
          </>
        )}
        <span className="text-foreground">{product.name}</span>
      </nav>

      {/* Gallery + buy box */}
      <div className="grid gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} />
        <ProductPurchase product={product} />
      </div>

      {/* Tabs */}
      <section className="mt-16">
        <ProductTabs product={product} />
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-20">
          <ProductRail
            eyebrow="You may also like"
            title="Related Posters"
            products={related}
          />
        </section>
      )}
    </div>
  );
}
