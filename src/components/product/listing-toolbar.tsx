"use client";

import { useState } from "react";
import { SlidersHorizontal } from "@/components/icons";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { SortSelect } from "./sort-select";
import { FilterSidebar } from "./filter-sidebar";

interface ListingToolbarProps {
  total: number;
  activeCount: number;
}

/** Sticky toolbar: result count, mobile filter sheet trigger, sort control. */
export function ListingToolbar({ total, activeCount }: ListingToolbarProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sticky top-[167px] z-20 -mx-4 mb-6 flex items-center justify-between gap-3 border-b bg-background/95 px-4 py-3 backdrop-blur lg:top-[107px]">
      <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
        <span className="font-bold text-foreground">{total}</span>{" "}
        {total === 1 ? "poster" : "posters"}
      </p>

      <div className="flex items-center gap-2">
        {/* Mobile filters */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="lg:hidden">
              <SlidersHorizontal className="size-4" />
              Filters
              {activeCount > 0 && (
                <span className="ml-1 grid size-5 place-items-center rounded-full bg-primary text-[10px] text-primary-foreground">
                  {activeCount}
                </span>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full sm:max-w-sm">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <div className="flex-1 overflow-y-auto scrollbar-thin p-6">
              <FilterSidebar />
            </div>
            <SheetFooter>
              <Button className="w-full" onClick={() => setOpen(false)}>
                Show {total} results
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>

        <SortSelect />
      </div>
    </div>
  );
}
