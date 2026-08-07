"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "@/components/icons";
import type { BannerData } from "@/types";

interface HeroProps {
  /** Admin-managed hero banners — used as the rotating backdrop imagery. */
  slides: BannerData[];
}

/**
 * Brand hero. The headline and CTAs are fixed brand copy; the imagery behind
 * them rotates through the hero banners the admin manages in `/admin/banners`.
 */
export function Hero({ slides }: HeroProps) {
  const [index, setIndex] = useState(0);
  const count = slides.length;

  useEffect(() => {
    if (count <= 1) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 6000);
    return () => clearInterval(t);
  }, [count]);

  const slide = count ? slides[index] : null;

  return (
    <section className="relative flex h-[72vh] min-h-[480px] w-full items-center overflow-hidden bg-black">
      {/* Brand backdrop — visible until a banner with artwork is published. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-br from-accent/30 via-black to-black"
      />
      <AnimatePresence mode="sync">
        {slide?.image && (
          <motion.div
            key={slide.id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/20" />

      <div className="relative z-10 mx-auto w-full max-w-[1400px] px-4">
        <div className="max-w-2xl text-white">
          <p className="mb-5 inline-flex items-center bg-accent px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.24em] text-accent-foreground">
            Iconik Posters
          </p>
          <h1 className="font-display text-5xl font-bold uppercase leading-[0.92] tracking-[0.005em] sm:text-7xl lg:text-8xl">
            Your Walls.
            <br />
            Your Story.
          </h1>
          <p className="mt-6 max-w-lg text-base text-white/85 sm:text-lg">
            Premium posters that bring your favourite movies, anime, games,
            cars, music and iconic moments to life.
          </p>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.22em] text-white/60">
            Designed to Impress. Printed to Last.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/shop"
              className="group inline-flex items-center gap-2 rounded-sm bg-accent px-9 py-4 text-xs font-bold uppercase tracking-[0.14em] text-accent-foreground transition-transform hover:scale-[1.02] active:scale-100"
            >
              Shop Now
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/collections"
              className="inline-flex items-center rounded-sm border border-white/50 px-9 py-4 text-xs font-bold uppercase tracking-[0.14em] text-white backdrop-blur-sm transition-colors hover:bg-white hover:text-black"
            >
              Explore Collections
            </Link>
          </div>
        </div>
      </div>

      {count > 1 && (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setIndex(i)}
              aria-label={`Background ${i + 1}`}
              className={`h-1 transition-all ${
                i === index ? "w-10 bg-accent" : "w-5 bg-white/40"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
