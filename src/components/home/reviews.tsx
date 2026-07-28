import { RatingStars } from "@/components/shared/rating-stars";
import { SectionHeading } from "@/components/shared/section-heading";

const reviews = [
  {
    quote: "The print quality exceeded my expectations.",
    author: "Aditya R.",
    context: "Verified buyer",
  },
  {
    quote: "My gaming setup looks amazing now.",
    author: "Sneha K.",
    context: "Verified buyer",
  },
  {
    quote: "Packaging was excellent. Worth every penny.",
    author: "Rahul M.",
    context: "Verified buyer",
  },
];

/** Social proof — three five-star customer reviews. */
export function Reviews() {
  return (
    <section className="space-y-8">
      <SectionHeading
        eyebrow="Customer Reviews"
        title="Loved by walls across India"
        align="center"
      />
      <div className="grid gap-4 md:grid-cols-3">
        {reviews.map((r) => (
          <figure
            key={r.quote}
            className="flex h-full flex-col gap-4 rounded-md border border-border bg-card p-7 transition-colors hover:border-foreground"
          >
            <RatingStars value={5} size="md" />
            <blockquote className="font-display text-xl font-semibold leading-snug">
              &ldquo;{r.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-auto text-xs uppercase tracking-[0.1em] text-muted-foreground">
              <span className="font-bold text-foreground">{r.author}</span> ·{" "}
              {r.context}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
