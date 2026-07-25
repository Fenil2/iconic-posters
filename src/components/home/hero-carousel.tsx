"use client";

import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import type { BannerData } from "@/types";

interface HeroCarouselProps {
  slides: BannerData[];
}

/** Full-bleed editorial hero with auto-advance, controls and progress dots. */
export function HeroCarousel({ slides }: HeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const go = useCallback(
    (dir: 1 | -1) => setIndex((i) => (i + dir + count) % count),
    [count],
  );

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(t);
  }, [count]);

  if (!count) return null;
  const slide = slides[index];

  return (
    <section className="relative h-[62vh] min-h-[440px] w-full overflow-hidden bg-primary sm:h-[72vh]">
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-10 mx-auto flex h-full max-w-[1400px] items-center px-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="max-w-xl text-white"
          >
            <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-white/70">
              PULSE Editions
            </p>
            <h1 className="font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
              {slide.title}
            </h1>
            {slide.subtitle && (
              <p className="mt-4 max-w-md text-base text-white/80 sm:text-lg">
                {slide.subtitle}
              </p>
            )}
            <Link
              href={slide.link ?? "/shop"}
              className="group mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-medium text-black transition-transform hover:scale-[1.02] active:scale-100"
            >
              {slide.ctaLabel ?? "Shop now"}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {count > 1 && (
        <>
          <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setIndex(i)}
                aria-label={`Slide ${i + 1}`}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-8 bg-white" : "w-4 bg-white/40"
                }`}
              />
            ))}
          </div>
          <div className="absolute inset-y-0 right-4 z-10 hidden items-center gap-2 sm:flex">
            <button
              onClick={() => go(-1)}
              aria-label="Previous"
              className="grid size-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next"
              className="grid size-11 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition-colors hover:bg-white/25"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </>
      )}
    </section>
  );
}
