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

const FALLBACK_BANNERS: BannerData[] = [
  {
    id: "f1",
    title: "Movie Wall",
    subtitle: "Cult classics and blockbuster art.",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&q=80",
    link: "/category/movies",
    ctaLabel: "Shop Movies",
  },
  {
    id: "f2",
    title: "Level Up Your Setup",
    subtitle: "Gaming posters built for the battlestation.",
    image:
      "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1600&q=80",
    link: "/category/gaming",
    ctaLabel: "Shop Gaming",
  },
  {
    id: "f3",
    title: "Machines & Legends",
    subtitle: "Supercars, superbikes and racing greats.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80",
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
      <div className="border-b bg-secondary/30">
        <div className="mx-auto grid max-w-[1400px] grid-cols-2 gap-4 px-4 py-6 md:grid-cols-4">
          {trust.map(({ icon: Icon, title, sub }) => (
            <div key={title} className="flex items-center gap-3">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-background">
                <Icon className="size-5" />
              </span>
              <div>
                <p className="text-sm font-medium">{title}</p>
                <p className="text-xs text-muted-foreground">{sub}</p>
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
        <section className="grid gap-6 md:grid-cols-2">
          {slides.slice(0, 2).map((s) => (
            <Link
              key={s.id}
              href={s.link ?? "/shop"}
              className="group relative aspect-[16/10] overflow-hidden rounded-2xl bg-primary"
            >
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${s.image})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 p-8 text-white">
                <h3 className="font-serif text-2xl font-semibold sm:text-3xl">
                  {s.title}
                </h3>
                <p className="mt-1 text-sm text-white/80">{s.ctaLabel} →</p>
              </div>
            </Link>
          ))}
        </section>

        <div className="flex justify-center">
          <Link
            href="/shop"
            className="inline-flex items-center rounded-full bg-primary px-9 py-3.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-[1.02] active:scale-100"
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
        <section className="rounded-2xl border border-border bg-secondary/30 px-6 py-12 sm:px-12">
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
