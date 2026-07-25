"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { Expand, ChevronLeft, ChevronRight } from "@/components/icons";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { ProductImageData } from "@/types";

/** Poster gallery: framed main view with hover-zoom and a fullscreen lightbox. */
export function ProductGallery({
  images,
  name,
}: {
  images: ProductImageData[];
  name: string;
}) {
  const gallery = images.length
    ? images
    : [{ id: "ph", url: "/placeholder-poster.jpg", alt: name }];
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const [origin, setOrigin] = useState("50% 50%");
  const [lightbox, setLightbox] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const rect = frameRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setOrigin(`${x}% ${y}%`);
  };

  const step = (dir: 1 | -1) =>
    setActive((i) => (i + dir + gallery.length) % gallery.length);

  return (
    <div className="flex flex-col-reverse gap-4 lg:flex-row">
      {/* Thumbnails */}
      <div className="flex gap-3 lg:flex-col">
        {gallery.map((img, i) => (
          <button
            key={img.id}
            onClick={() => setActive(i)}
            aria-label={`View image ${i + 1}`}
            className={cn(
              "relative size-16 shrink-0 overflow-hidden rounded-md border-2 bg-secondary transition-colors lg:size-20",
              i === active ? "border-primary" : "border-transparent hover:border-border",
            )}
          >
            <Image src={img.url} alt={img.alt} fill sizes="80px" className="object-cover" />
          </button>
        ))}
      </div>

      {/* Main framed view */}
      <div className="flex-1">
        <div
          ref={frameRef}
          onMouseEnter={() => setZoom(true)}
          onMouseLeave={() => setZoom(false)}
          onMouseMove={onMove}
          className="group relative aspect-[3/4] overflow-hidden rounded-xl bg-secondary"
        >
          {/* Matted frame */}
          <div className="absolute inset-0 p-8 sm:p-12">
            <div className="relative h-full w-full overflow-hidden bg-background shadow-[0_8px_40px_rgba(0,0,0,0.14)]">
              <Image
                src={gallery[active].url}
                alt={gallery[active].alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className={cn(
                  "object-cover transition-transform duration-200",
                  zoom ? "scale-[1.8]" : "scale-100",
                )}
                style={{ transformOrigin: origin }}
              />
            </div>
          </div>

          <button
            onClick={() => setLightbox(true)}
            aria-label="Fullscreen"
            className="absolute right-4 top-4 grid size-10 place-items-center rounded-full bg-background/80 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
          >
            <Expand className="size-4" />
          </button>

          {gallery.length > 1 && (
            <>
              <button
                onClick={() => step(-1)}
                aria-label="Previous"
                className="absolute left-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/80 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                onClick={() => step(1)}
                aria-label="Next"
                className="absolute right-3 top-1/2 grid size-10 -translate-y-1/2 place-items-center rounded-full bg-background/80 opacity-0 backdrop-blur transition-opacity group-hover:opacity-100"
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}
        </div>
        <p className="mt-2 text-center text-xs text-muted-foreground">
          Hover to zoom · Click the expand icon for fullscreen
        </p>
      </div>

      {/* Lightbox */}
      <Dialog open={lightbox} onOpenChange={setLightbox}>
        <DialogContent className="max-w-4xl border-0 bg-transparent p-0 shadow-none">
          <div className="relative aspect-[3/4] w-full max-h-[85vh]">
            <Image
              src={gallery[active].url}
              alt={gallery[active].alt}
              fill
              sizes="90vw"
              className="rounded-lg object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
