import Link from "next/link";
import { ArrowRight } from "@/components/icons";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  className?: string;
}

/** Editorial section header used across the storefront. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-end justify-between gap-4",
        align === "center" && "flex-col items-center text-center",
        className,
      )}
    >
      <div className={cn("space-y-2", align === "center" && "max-w-xl")}>
        {eyebrow && (
          <p
            className={cn(
              "flex items-center gap-2.5 text-[11px] font-bold uppercase tracking-[0.22em] text-accent",
              align === "center" && "justify-center",
            )}
          >
            <span aria-hidden className="h-px w-6 bg-accent" />
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-2xl font-bold uppercase leading-[1.05] tracking-[0.01em] sm:text-3xl md:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="max-w-prose text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1.5 border-b-2 border-foreground pb-0.5 text-[11px] font-bold uppercase tracking-[0.14em] transition-colors hover:border-accent hover:text-accent"
        >
          {linkLabel}
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
