import type { Metadata } from "next";
import Link from "next/link";
import { storeCollections } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Shop By Collection",
  description:
    "Browse every Iconik Posters collection — movies, gaming, anime, cars & bikes, music, quotes, love, aesthetic, space, sports and minimal wall posters.",
  alternates: { canonical: "/collections" },
};

export default function CollectionsPage() {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-16">
      <h1 className="font-serif text-4xl font-semibold tracking-tight">
        Shop By Collection
      </h1>
      <p className="mt-2 max-w-xl text-muted-foreground">
        Eleven worlds to pick from — and new designs added regularly. Find the
        one that matches your vibe.
      </p>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {storeCollections.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="group relative aspect-[4/3] overflow-hidden rounded-2xl bg-foreground text-background"
          >
            <c.icon
              aria-hidden
              className="absolute -right-6 -top-6 size-40 text-background/10 transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-x-0 bottom-0 p-6">
              <p className="flex items-center gap-2.5 font-serif text-2xl font-semibold">
                <c.icon aria-hidden className="size-6 shrink-0" />
                {c.label}
              </p>
              <p className="mt-1 text-sm text-background/70">{c.blurb}</p>
            </div>
          </Link>
        ))}

        <Link
          href="/shop"
          className="flex aspect-[4/3] flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border text-center transition-colors hover:border-foreground/30"
        >
          <p className="font-serif text-2xl font-semibold">And many more…</p>
          <p className="text-sm text-muted-foreground">
            Browse the full {siteConfig.name} catalogue
          </p>
        </Link>
      </div>
    </div>
  );
}
