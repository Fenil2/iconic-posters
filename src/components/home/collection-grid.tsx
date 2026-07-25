import Link from "next/link";
import { storeCollections } from "@/config/navigation";
import { SectionHeading } from "@/components/shared/section-heading";

/** "Shop By Collection" — every store collection as an emoji-led tile. */
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
            className="group relative flex items-center gap-3 overflow-hidden rounded-xl border border-border bg-secondary/30 p-4 transition-colors hover:border-foreground/25 hover:bg-secondary/60"
          >
            <span
              aria-hidden
              className="grid size-11 shrink-0 place-items-center rounded-full bg-background text-xl transition-transform group-hover:scale-110"
            >
              {c.emoji}
            </span>
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium">
                {c.label}
              </span>
              <span className="block truncate text-xs text-muted-foreground">
                Shop now
              </span>
            </span>
          </Link>
        ))}

        <Link
          href="/shop"
          className="flex items-center justify-center rounded-xl border border-dashed border-border p-4 text-sm font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
        >
          And many more…
        </Link>
      </div>
    </section>
  );
}
