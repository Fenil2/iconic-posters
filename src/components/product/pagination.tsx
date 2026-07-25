"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface PaginationProps {
  page: number;
  pageCount: number;
}

/** URL-driven pagination with a compact windowed page list. */
export function Pagination({ page, pageCount }: PaginationProps) {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();

  if (pageCount <= 1) return null;

  const goto = (p: number) => {
    const next = new URLSearchParams(params.toString());
    if (p <= 1) next.delete("page");
    else next.set("page", String(p));
    const qs = next.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: true });
  };

  // Windowed pages: 1 … p-1 p p+1 … last
  const pages = new Set<number>([1, pageCount, page, page - 1, page + 1]);
  const list = [...pages].filter((p) => p >= 1 && p <= pageCount).sort((a, b) => a - b);

  return (
    <nav className="flex items-center justify-center gap-1.5" aria-label="Pagination">
      <button
        onClick={() => goto(page - 1)}
        disabled={page <= 1}
        className="grid size-10 place-items-center rounded-md border border-border transition-colors hover:bg-secondary disabled:opacity-40"
        aria-label="Previous page"
      >
        <ChevronLeft className="size-4" />
      </button>

      {list.map((p, i) => {
        const prev = list[i - 1];
        const gap = prev && p - prev > 1;
        return (
          <span key={p} className="flex items-center gap-1.5">
            {gap && <span className="px-1 text-muted-foreground">…</span>}
            <button
              onClick={() => goto(p)}
              aria-current={p === page ? "page" : undefined}
              className={cn(
                "grid size-10 place-items-center rounded-md border text-sm transition-colors",
                p === page
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border hover:bg-secondary",
              )}
            >
              {p}
            </button>
          </span>
        );
      })}

      <button
        onClick={() => goto(page + 1)}
        disabled={page >= pageCount}
        className="grid size-10 place-items-center rounded-md border border-border transition-colors hover:bg-secondary disabled:opacity-40"
        aria-label="Next page"
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
