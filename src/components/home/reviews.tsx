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
            className="flex h-full flex-col gap-4 rounded-2xl border border-border bg-secondary/25 p-7"
          >
            <RatingStars value={5} size="md" />
            <blockquote className="font-serif text-lg leading-snug">
              &ldquo;{r.quote}&rdquo;
            </blockquote>
            <figcaption className="mt-auto text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{r.author}</span> ·{" "}
              {r.context}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
