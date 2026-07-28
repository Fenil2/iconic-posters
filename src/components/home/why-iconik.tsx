import Link from "next/link";
import { Check, ArrowRight } from "@/components/icons";
import { storeCollections } from "@/config/navigation";

const reasons = [
  "Premium Print Quality",
  "Vibrant & Fade-Resistant Colours",
  "Multiple Sizes Available",
  "Secure Packaging",
  "Fast Shipping Across India",
  "New Designs Added Regularly",
];

/** "Why Iconik Posters?" editorial block + the "Why Choose Us?" tick list. */
export function WhyIconik() {
  const showcase = storeCollections.slice(0, 4);

  return (
    <section className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
      <div className="grid grid-cols-2 gap-3">
        {showcase.map((c, i) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className={`group relative overflow-hidden rounded-md bg-secondary ${
              i % 3 === 0 ? "aspect-[4/5]" : "aspect-square"
            }`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: `url(${c.image})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
            <span className="absolute bottom-4 left-4 flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.12em] text-white">
              <c.icon aria-hidden className="size-4 shrink-0 text-accent" />
              {c.label}
            </span>
          </Link>
        ))}
      </div>

      <div>
        <p className="flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-accent">
          <span aria-hidden className="h-px w-6 bg-accent" />
          Why Iconik Posters?
        </p>
        <h2 className="mt-3 font-display text-3xl font-bold uppercase leading-[1.05] sm:text-4xl">
          Your walls deserve more than empty space.
        </h2>
        <p className="mt-5 text-[15px] leading-relaxed text-muted-foreground">
          At Iconik Posters, we create posters that reflect your personality.
          Whether you&rsquo;re an anime fan, Marvel addict, gamer, petrolhead,
          movie buff or someone who simply loves aesthetic interiors — we&rsquo;ve
          got something made for you.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground">
          Every design is printed using premium-quality materials to deliver
          vibrant colours, sharp details and long-lasting durability.
        </p>

        <h3 className="mt-9 font-display text-xl font-bold uppercase tracking-wide">
          Why Choose Us?
        </h3>
        <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {reasons.map((r) => (
            <li key={r} className="flex items-start gap-2.5 text-sm">
              <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded-full bg-accent">
                <Check className="size-3 text-accent-foreground" />
              </span>
              <span>{r}</span>
            </li>
          ))}
        </ul>

        <Link
          href="/about"
          className="group mt-8 inline-flex items-center gap-1.5 border-b-2 border-foreground pb-0.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors hover:border-accent hover:text-accent"
        >
          More about us
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>
    </section>
  );
}
