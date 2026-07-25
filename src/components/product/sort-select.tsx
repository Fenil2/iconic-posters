"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useQueryFilters } from "@/hooks/use-query-filters";
import { SORT_OPTIONS } from "@/config/filters";

export function SortSelect() {
  const { params, setValue } = useQueryFilters();
  const current = params.get("sort") ?? "relevance";

  return (
    <Select value={current} onValueChange={(v) => setValue("sort", v)}>
      <SelectTrigger className="h-10 w-[190px]">
        <span className="text-muted-foreground">Sort:</span>
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        {SORT_OPTIONS.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
