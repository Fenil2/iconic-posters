import Link from "next/link";
import { cn } from "@/lib/utils";

/** PULSE wordmark — Fraunces display serif with a pulse accent dot. */
export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="PULSE home"
      className={cn(
        "font-serif text-2xl font-semibold tracking-tight leading-none",
        className,
      )}
    >
      PULSE
      <span className="text-accent">.</span>
    </Link>
  );
}
