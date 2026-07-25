import Link from "next/link";
import { cn } from "@/lib/utils";

/** Iconik Posters wordmark — Fraunces display serif with a brass accent dot. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Iconik Posters home"
      className={cn(
        "font-serif text-2xl font-semibold tracking-tight leading-none whitespace-nowrap",
        className,
      )}
    >
      ICONIK
      <span className="text-accent">.</span>
    </Link>
  );
}
