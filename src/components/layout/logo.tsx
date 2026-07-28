import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Intrinsic dimensions of the exported artwork in `/public`. */
const MARK = { w: 568, h: 702 };
const LOCKUP = { w: 572, h: 999 };

type LogoVariant = "horizontal" | "stacked" | "mark";

interface LogoProps {
  className?: string;
  /**
   * `horizontal` — stencil mark + wordmark, for the header.
   * `stacked` — the full artwork lockup, for footers and auth panels.
   * `mark` — the poster glyph on its own.
   */
  variant?: LogoVariant;
  /** Force the white artwork — for permanently dark surfaces. */
  onDark?: boolean;
}

/**
 * Iconik Posters identity. The artwork ships as two transparent PNGs — black
 * ink for light surfaces, white for dark — swapped with the `dark:` variant so
 * there is no theme-dependent render on the client.
 */
export function Logo({
  className,
  variant = "horizontal",
  onDark = false,
}: LogoProps) {
  const size = variant === "stacked" ? LOCKUP : MARK;
  const src = variant === "stacked" ? "iconik-lockup" : "iconik-mark";

  const artwork = (
    <>
      <Image
        src={`/${src}-${onDark ? "light" : "dark"}.png`}
        alt="Iconik Posters"
        width={size.w}
        height={size.h}
        priority
        className={cn("h-full w-auto", !onDark && "dark:hidden")}
      />
      {!onDark && (
        <Image
          src={`/${src}-light.png`}
          alt=""
          aria-hidden
          width={size.w}
          height={size.h}
          className="hidden h-full w-auto dark:block"
        />
      )}
    </>
  );

  if (variant === "stacked" || variant === "mark") {
    return (
      <Link
        href="/"
        aria-label="Iconik Posters home"
        className={cn(
          "inline-flex shrink-0",
          variant === "stacked" ? "h-20" : "h-9",
          className,
        )}
      >
        {artwork}
      </Link>
    );
  }

  return (
    <Link
      href="/"
      aria-label="Iconik Posters home"
      className={cn("group inline-flex shrink-0 items-center gap-2.5", className)}
    >
      <span className="flex h-9 shrink-0 sm:h-10">{artwork}</span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-xl font-bold uppercase leading-none tracking-[0.02em] sm:text-2xl">
          Iconik
        </span>
        <span className="mt-0.5 text-[9px] font-semibold uppercase leading-none tracking-[0.42em] text-muted-foreground sm:text-[10px]">
          Posters
        </span>
      </span>
    </Link>
  );
}
