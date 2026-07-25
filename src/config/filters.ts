import type { SortOption } from "@/types";

/** Purchasable poster sizes (match seed variant sizes). */
export const SIZE_OPTIONS = [
  { value: "A4", label: 'A4 · 8.3×11.7"' },
  { value: "A3", label: 'A3 · 11.7×16.5"' },
  { value: "18x24", label: '18×24"' },
  { value: "24x36", label: '24×36"' },
];

export const FRAME_OPTIONS = [
  { value: "None", label: "No frame (print only)" },
  { value: "Black Wood", label: "Black Wood" },
  { value: "Natural Oak", label: "Natural Oak" },
  { value: "White Metal", label: "White Metal" },
];

export const ORIENTATION_OPTIONS = [
  { value: "PORTRAIT", label: "Portrait" },
  { value: "LANDSCAPE", label: "Landscape" },
  { value: "SQUARE", label: "Square" },
];

export const COLOR_OPTIONS = [
  { value: "black", label: "Black", hex: "#111111" },
  { value: "blue", label: "Blue", hex: "#2563eb" },
  { value: "red", label: "Red", hex: "#dc2626" },
  { value: "orange", label: "Orange", hex: "#ea580c" },
  { value: "green", label: "Green", hex: "#16a34a" },
  { value: "purple", label: "Purple", hex: "#7c3aed" },
  { value: "beige", label: "Beige", hex: "#d6c8b0" },
];

export const PRICE_MIN = 0;
export const PRICE_MAX = 5000;

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: "relevance", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating", label: "Top Rated" },
  { value: "bestselling", label: "Best Selling" },
];

export const RATING_OPTIONS = [4, 3, 2, 1];
