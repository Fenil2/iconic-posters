import Link from "next/link";
import type { Metadata } from "next";
import { Truck, ShieldCheck, PackageCheck, Sparkles } from "@/components/icons";
import { Hero } from "@/components/home/hero";
import { CollectionGrid } from "@/components/home/collection-grid";
import { WhyIconik } from "@/components/home/why-iconik";
import { Spaces } from "@/components/home/spaces";
import { Reviews } from "@/components/home/reviews";
import { ProductRail } from "@/components/product/product-rail";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  getTrending,
  getBestSellers,
  getNewArrivals,
} from "@/server/queries/products";
import { getHeroBanners, safe } from "@/server/queries/content";
import { siteConfig } from "@/config/site";
import type { BannerData } from "@/types";

// Rails read the live catalogue; keep this dynamic so fresh stock shows.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    absolute: siteConfig.seoHeadline,
  },
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

/**
 * Shown until the admin adds hero banners in `/admin/banners`. Imagery is
 * intentionally left blank — the hero and the editorial split fall back to
 * brand typography rather than borrowed photography.
 */
const FALLBACK_BANNERS: BannerData[] = [
  {
    id: "f1",
    title: "Movie Wall",
    subtitle: "Cult classics and blockbuster art.",
    image: null,
    link: "/category/movies",
    ctaLabel: "Shop Movies",
  },
  {
    id: "f2",
    title: "Level Up Your Setup",
    subtitle: "Gaming posters built for the battlestation.",
    image: null,
    link: "/category/gaming",
    ctaLabel: "Shop Gaming",
  },
  {
    id: "f3",
    title: "Machines & Legends",
    subtitle: "Supercars, superbikes and racing greats.",
    image: null,
    link: "/category/cars-bikes",
    ctaLabel: "Shop Cars & Bikes",
  },
];

const trust = [
  { icon: Truck, title: "Fast shipping across India", sub: "3–7 business days" },
  { icon: PackageCheck, title: "Secure packaging", sub: "Rigid, damage-proof tubes" },
  { icon: ShieldCheck, title: "Secure checkout", sub: "Razorpay protected" },
  { icon: Sparkles, title: "New designs weekly", sub: "Fresh drops, regularly" },
];

export default async function HomePage() {
  const [banners, trending, best, latest] = await Promise.all([
    safe(getHeroBanners, []),
    safe(() => getTrending(10), []),
    safe(() => getBestSellers(10), []),
    safe(() => getNewArrivals(10), []),
  ]);

  const slides = banners.length ? banners : FALLBACK_BANNERS;
  // Trending is the headline rail; fall back to best sellers on a thin catalogue.
  const trendingRail = trending.length ? trending : best;

  return (
    <>
      <Hero slides={slides} />

      {/* Trust strip */}
      <div className="bg-foreground text-background">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 divide-x divide-background/15 px-4 py-5 md:grid-cols-4">
          {trust.map(({ icon: Icon, title, sub }) => (
            <div
              key={title}
              className="flex items-center gap-3 px-3 py-2 first:pl-0 last:pr-0"
            >
              <Icon className="size-6 shrink-0 text-accent" />
              <div className="min-w-0">
                <p className="truncate text-[11px] font-bold uppercase tracking-[0.1em]">
                  {title}
                </p>
                <p className="truncate text-[11px] text-background/60">{sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-[1400px] space-y-20 px-4 py-16">
        <WhyIconik />

        <CollectionGrid />

        {trendingRail.length > 0 && (
          <ProductRail
            eyebrow="Trending Posters"
            title="Most Loved by Our Community"
            href="/shop"
            products={trendingRail}
          />
        )}

        {/* Editorial split feature */}
        <section className="grid gap-4 md:grid-cols-2">
          {slides.slice(0, 2).map((s) => (
            <Link
              key={s.id}
              href={s.link ?? "/shop"}
              className="group relative aspect-[16/10] overflow-hidden rounded-md bg-black"
            >
              {s.image ? (
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url(${s.image})` }}
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-accent/30 via-black to-black transition-transform duration-700 group-hover:scale-105" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
              <div className="absolute bottom-0 p-6 text-white sm:p-8">
                <h3 className="font-display text-2xl font-bold uppercase leading-none sm:text-4xl">
                  {s.title}
                </h3>
                <p className="mt-3 inline-flex items-center gap-2 border-b-2 border-accent pb-0.5 text-[11px] font-bold uppercase tracking-[0.14em]">
                  {s.ctaLabel} →
                </p>
              </div>
            </Link>
          ))}
        </section>

        <div className="flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center rounded-sm bg-primary px-12 py-4 text-xs font-bold uppercase tracking-[0.16em] text-primary-foreground transition-transform hover:scale-[1.02] active:scale-100"
          >
            View All Posters
          </Link>
        </div>

        <Spaces />

        {latest.length > 0 && (
          <ProductRail
            eyebrow="Just landed"
            title="New Arrivals"
            href="/new-arrivals"
            products={latest}
          />
        )}

        <Reviews />

        {/* Stay Updated */}
        <section className="rounded-md bg-foreground px-6 py-14 text-background sm:px-12 [&_h2]:text-background [&_p]:text-background/70">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-6 text-center">
            <SectionHeading
              title="Stay Updated"
              description="Never miss new collections, exclusive launches, limited editions and exciting offers."
              align="center"
            />
            <NewsletterForm />
          </div>
        </section>
      </div>
    </>
  );
}
