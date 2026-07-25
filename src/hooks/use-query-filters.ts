"use client";

import { useCallback } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/**
 * Helpers to read & mutate multi-value filter state stored in the URL query.
 * Every mutation resets pagination to page 1 and preserves unrelated params.
 */
export function useQueryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  const getList = useCallback(
    (key: string): string[] => {
      const raw = params.get(key);
      return raw ? raw.split(",").filter(Boolean) : [];
    },
    [params],
  );

  const commit = useCallback(
    (next: URLSearchParams) => {
      next.delete("page");
      const qs = next.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const toggle = useCallback(
    (key: string, value: string) => {
      const next = new URLSearchParams(params.toString());
      const current = new Set(getList(key));
      if (current.has(value)) current.delete(value);
      else current.add(value);
      if (current.size) next.set(key, [...current].join(","));
      else next.delete(key);
      commit(next);
    },
    [params, getList, commit],
  );

  const setValue = useCallback(
    (key: string, value?: string | number) => {
      const next = new URLSearchParams(params.toString());
      if (value === undefined || value === "" || value === null) next.delete(key);
      else next.set(key, String(value));
      commit(next);
    },
    [params, commit],
  );

  const setRange = useCallback(
    (min?: number, max?: number) => {
      const next = new URLSearchParams(params.toString());
      if (min != null) next.set("minPrice", String(min));
      else next.delete("minPrice");
      if (max != null) next.set("maxPrice", String(max));
      else next.delete("maxPrice");
      commit(next);
    },
    [params, commit],
  );

  const clearAll = useCallback(() => {
    const next = new URLSearchParams();
    const sort = params.get("sort");
    const q = params.get("q");
    if (sort) next.set("sort", sort);
    if (q) next.set("q", q);
    commit(next);
  }, [params, commit]);

  return { params, getList, toggle, setValue, setRange, clearAll };
}
