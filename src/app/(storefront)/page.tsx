import Link from "next/link";
import { Suspense } from "react";
import { Truck, RotateCcw, ShieldCheck, Palette } from "lucide-react";
import { HeroCarousel } from "@/components/home/hero-carousel";
import { CategoryGrid } from "@/components/home/category-grid";
import { Countdown } from "@/components/home/countdown";
import { ProductRail } from "@/components/product/product-rail";
import { SectionHeading } from "@/components/shared/section-heading";
import {
  getBestSellers,
  getTrending,
  getNewArrivals,
  getLimitedEdition,
  getFeaturedProducts,
} from "@/server/queries/products";
import { getHeroBanners, safe } from "@/server/queries/content";
import type { BannerData } from "@/types";

// Rails read the live catalogue; keep this dynamic so fresh stock shows.
export const dynamic = "force-dynamic";

const FALLBACK_BANNERS: BannerData[] = [
  {
    id: "f1",
    title: "Ride the Redline",
    subtitle: "Superbike & MotoGP prints for the speed obsessed.",
    image:
      "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=1600&q=80",
    link: "/category/bikes",
    ctaLabel: "Shop Bikes",
  },
  {
    id: "f2",
    title: "Machines & Legends",
    subtitle: "Supercars, JDM icons and Formula 1, framed.",
    image:
      "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1600&q=80",
    link: "/category/cars",
    ctaLabel: "Shop Cars",
  },
];

const trust = [
  { icon: Truck, title: "Free shipping", sub: "On orders over ₹999" },
  { icon: RotateCcw, title: "7-day returns", sub: "Easy & hassle-free" },
  { icon: ShieldCheck, title: "Secure checkout", sub: "Razorpay protected" },
  { icon: Palette, title: "Archival prints", sub: "100+ year fade resistance" },
];

export default async function HomePage() {
  const [banners, best, trending, latest, limited, featured] = await Promise.all(
    [
      safe(getHeroBanners, []),
      safe(() => getBestSellers(10), []),
      safe(() => getTrending(10), []),
      safe(() => getNewArrivals(10), []),
      safe(() => getLimitedEdition(10), []),
      safe(() => getFeaturedProducts(6), []),
    ],
  );

  const slides = banners.length ? banners : FALLBACK_BANNERS;
  const saleEnd = new Date(Date.now() + 2 * 86400000 + 5 * 3600000);

  return (
    <>
      <HeroCarousel slides={slides} />

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
        <CategoryGrid />

        {best.length > 0 && (
          <ProductRail
            eyebrow="Most loved"
            title="Best Sellers"
            description="The prints our customers can't stop framing."
            href="/best-sellers"
            products={best}
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

        {trending.length > 0 && (
          <ProductRail
            eyebrow="Right now"
            title="Trending This Week"
            href="/best-sellers"
            products={trending}
          />
        )}

        {/* Flash sale */}
        <section className="overflow-hidden rounded-2xl border bg-secondary/40">
          <div className="flex flex-col items-start justify-between gap-6 p-8 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-destructive">
                Flash Sale
              </p>
              <h2 className="mt-1 font-serif text-3xl font-semibold">
                Today’s Deals — up to 40% off
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Hand-picked prints at collector prices. Ends soon.
              </p>
            </div>
            <div className="flex flex-col items-start gap-3 sm:items-end">
              <Countdown target={saleEnd} />
              <Link
                href="/sale"
                className="inline-flex items-center rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground"
              >
                Shop the sale
              </Link>
            </div>
          </div>
          {featured.length > 0 && (
            <div className="grid grid-cols-2 gap-px bg-border sm:grid-cols-3 lg:grid-cols-6">
              {featured.map((p) => (
                <Link
                  key={p.id}
                  href={`/product/${p.slug}`}
                  className="group relative aspect-square overflow-hidden bg-background"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url(${p.image})` }}
                  />
                </Link>
              ))}
            </div>
          )}
        </section>

        {latest.length > 0 && (
          <ProductRail
            eyebrow="Just landed"
            title="New Arrivals"
            href="/new-arrivals"
            products={latest}
          />
        )}

        {limited.length > 0 && (
          <ProductRail
            eyebrow="Numbered & signed"
            title="Limited Edition"
            description="Collector prints in strictly limited runs."
            href="/collection/limited-edition"
            products={limited}
          />
        )}

        {/* Instagram gallery */}
        <section className="space-y-6">
          <SectionHeading
            eyebrow="@pulse.posters"
            title="From the community"
            description="Tag us to be featured. Real walls, real PULSE."
            align="center"
          />
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {featured.concat(best).slice(0, 6).map((p) => (
              <div
                key={`ig-${p.id}`}
                className="group relative aspect-square overflow-hidden rounded-lg bg-secondary"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${p.image})` }}
                />
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
