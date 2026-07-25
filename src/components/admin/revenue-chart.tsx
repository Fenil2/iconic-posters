"use client";

import { formatPrice } from "@/lib/utils";

/** Dependency-free bar chart for the 14-day revenue trend. */
export function RevenueChart({ data }: { data: { date: string; revenue: number }[] }) {
  const max = Math.max(...data.map((d) => d.revenue), 1);

  return (
    <div className="flex h-52 items-end gap-1.5">
      {data.map((d) => (
        <div key={d.date} className="group flex flex-1 flex-col items-center gap-2">
          <div className="relative flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t bg-chart-1 transition-all group-hover:bg-primary"
              style={{ height: `${(d.revenue / max) * 100}%`, minHeight: d.revenue > 0 ? "4px" : "0" }}
            />
            <div className="pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-primary px-2 py-1 text-[10px] text-primary-foreground opacity-0 transition-opacity group-hover:opacity-100">
              {formatPrice(d.revenue)}
            </div>
          </div>
          <span className="text-[9px] text-muted-foreground">{d.date.split(" ")[0]}</span>
        </div>
      ))}
    </div>
  );
}
