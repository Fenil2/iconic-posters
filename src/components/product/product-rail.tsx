"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "@/components/icons";
import { ProductCard } from "./product-card";
import { SectionHeading } from "@/components/shared/section-heading";
import type { ProductCardData } from "@/types";

interface ProductRailProps {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  products: ProductCardData[];
}

/** Horizontally scrollable product carousel with snap + arrow controls. */
export function ProductRail({
  eyebrow,
  title,
  description,
  href,
  products,
}: ProductRailProps) {
  const scroller = useRef<HTMLDivElement>(null);

  if (!products.length) return null;

  const scrollBy = (dir: 1 | -1) => {
    scroller.current?.scrollBy({
      left: dir * (scroller.current.clientWidth * 0.8),
      behavior: "smooth",
    });
  };

  return (
    <section className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <SectionHeading
          eyebrow={eyebrow}
          title={title}
          description={description}
          href={href}
        />
        <div className="hidden shrink-0 gap-2 md:flex">
          <button
            type="button"
            onClick={() => scrollBy(-1)}
            aria-label="Scroll left"
            className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:bg-secondary"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => scrollBy(1)}
            aria-label="Scroll right"
            className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:bg-secondary"
          >
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <div
        ref={scroller}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0"
      >
        {products.map((p) => (
          <div
            key={p.id}
            className="w-[46%] shrink-0 snap-start sm:w-[31%] md:w-[23%] lg:w-[19%]"
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </section>
  );
}
