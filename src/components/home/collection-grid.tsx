import Link from "next/link";
import { storeCollections } from "@/config/navigation";
import { SectionHeading } from "@/components/shared/section-heading";

/** "Shop By Collection" — every store collection as an icon-led tile. */
export function CollectionGrid() {
  return (
    <section className="space-y-8">
      <SectionHeading
        eyebrow="Find your vibe"
        title="Shop By Collection"
        description="Eleven worlds to pick from — and new designs added regularly."
        href="/collections"
        linkLabel="All collections"
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {storeCollections.map((c) => (
          <Link
            key={c.slug}
            href={`/category/${c.slug}`}
            className="group relative flex items-center gap-3 overflow-hidden rounded-md border border-border bg-card p-4 transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
          >
            <span
              aria-hidden
              className="grid size-11 shrink-0 place-items-center rounded-sm bg-secondary transition-colors group-hover:bg-accent group-hover:text-accent-foreground"
            >
              <c.icon className="size-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate font-display text-base font-bold uppercase tracking-wide">
                {c.label}
              </span>
              <span className="block truncate text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground group-hover:text-background/60">
                Shop now
              </span>
            </span>
          </Link>
        ))}

        <Link
          href="/shop"
          className="flex items-center justify-center rounded-md border border-dashed border-border p-4 text-[11px] font-bold uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
        >
          And many more…
        </Link>
      </div>
    </section>
  );
}
