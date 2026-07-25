"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { cn, formatPrice } from "@/lib/utils";
import { useQueryFilters } from "@/hooks/use-query-filters";
import {
  SIZE_OPTIONS,
  FRAME_OPTIONS,
  ORIENTATION_OPTIONS,
  COLOR_OPTIONS,
  RATING_OPTIONS,
  PRICE_MIN,
  PRICE_MAX,
} from "@/config/filters";

/** Full faceted filter panel (used in the sidebar and mobile filter sheet). */
export function FilterSidebar() {
  const { params, getList, toggle, setValue, setRange, clearAll } =
    useQueryFilters();

  const [range, setLocalRange] = useState<[number, number]>([
    Number(params.get("minPrice") ?? PRICE_MIN),
    Number(params.get("maxPrice") ?? PRICE_MAX),
  ]);

  const activeSizes = getList("size");
  const activeFrames = getList("frame");
  const activeOrient = getList("orientation");
  const activeColors = getList("color");
  const activeRating = Number(params.get("rating") ?? 0);
  const inStock = params.get("inStock") === "1";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Filters</h3>
        <button
          onClick={clearAll}
          className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
        >
          Clear all
        </button>
      </div>

      {/* Availability */}
      <label className="flex items-center justify-between rounded-lg border border-border px-3 py-2.5">
        <span className="text-sm">In stock only</span>
        <Switch
          checked={inStock}
          onCheckedChange={(v) => setValue("inStock", v ? "1" : undefined)}
        />
      </label>

      <Accordion
        type="multiple"
        defaultValue={["price", "size", "frame", "rating"]}
        className="rounded-lg border border-border px-4"
      >
        {/* Price */}
        <AccordionItem value="price">
          <AccordionTrigger>Price</AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <Slider
              min={PRICE_MIN}
              max={PRICE_MAX}
              step={100}
              value={range}
              onValueChange={(v) => setLocalRange(v as [number, number])}
              onValueCommit={(v) =>
                setRange((v as number[])[0], (v as number[])[1])
              }
            />
            <div className="flex items-center justify-between text-sm">
              <span className="rounded-md bg-secondary px-2 py-1">
                {formatPrice(range[0])}
              </span>
              <span className="text-muted-foreground">to</span>
              <span className="rounded-md bg-secondary px-2 py-1">
                {formatPrice(range[1])}
              </span>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Size */}
        <AccordionItem value="size">
          <AccordionTrigger>Size</AccordionTrigger>
          <AccordionContent className="space-y-2.5 pt-1">
            {SIZE_OPTIONS.map((o) => (
              <FilterCheck
                key={o.value}
                label={o.label}
                checked={activeSizes.includes(o.value)}
                onToggle={() => toggle("size", o.value)}
              />
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Frame */}
        <AccordionItem value="frame">
          <AccordionTrigger>Frame</AccordionTrigger>
          <AccordionContent className="space-y-2.5 pt-1">
            {FRAME_OPTIONS.map((o) => (
              <FilterCheck
                key={o.value}
                label={o.label}
                checked={activeFrames.includes(o.value)}
                onToggle={() => toggle("frame", o.value)}
              />
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Orientation */}
        <AccordionItem value="orientation">
          <AccordionTrigger>Orientation</AccordionTrigger>
          <AccordionContent className="space-y-2.5 pt-1">
            {ORIENTATION_OPTIONS.map((o) => (
              <FilterCheck
                key={o.value}
                label={o.label}
                checked={activeOrient.includes(o.value)}
                onToggle={() => toggle("orientation", o.value)}
              />
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Colour */}
        <AccordionItem value="color">
          <AccordionTrigger>Colour</AccordionTrigger>
          <AccordionContent className="flex flex-wrap gap-2 pt-2">
            {COLOR_OPTIONS.map((o) => {
              const active = activeColors.includes(o.value);
              return (
                <button
                  key={o.value}
                  onClick={() => toggle("color", o.value)}
                  aria-label={o.label}
                  title={o.label}
                  className={cn(
                    "size-8 rounded-full border-2 transition-transform hover:scale-110",
                    active
                      ? "border-foreground ring-2 ring-ring ring-offset-2 ring-offset-background"
                      : "border-border",
                  )}
                  style={{ backgroundColor: o.hex }}
                />
              );
            })}
          </AccordionContent>
        </AccordionItem>

        {/* Rating */}
        <AccordionItem value="rating">
          <AccordionTrigger>Rating</AccordionTrigger>
          <AccordionContent className="space-y-1 pt-1">
            {RATING_OPTIONS.map((r) => (
              <button
                key={r}
                onClick={() =>
                  setValue("rating", activeRating === r ? undefined : r)
                }
                className={cn(
                  "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-secondary",
                  activeRating === r && "bg-secondary",
                )}
              >
                <span className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={cn(
                        "size-3.5",
                        i < r ? "fill-accent text-accent" : "text-border",
                      )}
                    />
                  ))}
                </span>
                <span className="text-muted-foreground">& up</span>
              </button>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function FilterCheck({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 text-sm">
      <Checkbox checked={checked} onCheckedChange={onToggle} />
      <span className={cn(checked && "font-medium")}>{label}</span>
    </label>
  );
}
