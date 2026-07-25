import type { ProductFilters, SortOption } from "@/types";

type SearchParams = Record<string, string | string[] | undefined>;

const asString = (v: string | string[] | undefined): string | undefined =>
  Array.isArray(v) ? v[0] : v;

const asList = (v: string | string[] | undefined): string[] | undefined => {
  const s = asString(v);
  if (!s) return undefined;
  const list = s.split(",").map((x) => x.trim()).filter(Boolean);
  return list.length ? list : undefined;
};

const asNumber = (v: string | string[] | undefined): number | undefined => {
  const s = asString(v);
  if (!s) return undefined;
  const n = Number(s);
  return Number.isFinite(n) ? n : undefined;
};

const SORTS: SortOption[] = [
  "relevance",
  "newest",
  "price-asc",
  "price-desc",
  "rating",
  "bestselling",
];

/** Parse a Next.js searchParams object into typed ProductFilters. */
export function parseFilters(
  params: SearchParams,
  overrides: Partial<ProductFilters> = {},
): ProductFilters {
  const sortRaw = asString(params.sort) as SortOption | undefined;
  return {
    q: asString(params.q),
    category: asString(params.category),
    theme: asList(params.theme),
    color: asList(params.color),
    size: asList(params.size),
    frame: asList(params.frame),
    orientation: asList(params.orientation),
    minPrice: asNumber(params.minPrice),
    maxPrice: asNumber(params.maxPrice),
    minRating: asNumber(params.rating),
    inStock: asString(params.inStock) === "1",
    onSale: asString(params.onSale) === "1",
    sort: sortRaw && SORTS.includes(sortRaw) ? sortRaw : "relevance",
    page: asNumber(params.page) ?? 1,
    ...overrides,
  };
}

/** Count active facet filters (excludes sort/page/category/q) for badges. */
export function countActiveFilters(f: ProductFilters): number {
  let n = 0;
  n += f.theme?.length ?? 0;
  n += f.color?.length ?? 0;
  n += f.size?.length ?? 0;
  n += f.frame?.length ?? 0;
  n += f.orientation?.length ?? 0;
  if (f.minPrice != null || f.maxPrice != null) n += 1;
  if (f.minRating) n += 1;
  if (f.inStock) n += 1;
  return n;
}
