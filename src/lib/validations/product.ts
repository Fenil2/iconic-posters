import { z } from "zod";

export const variantSchema = z.object({
  id: z.string().optional(),
  size: z.string().min(1, "Size is required"),
  paperType: z.string().min(1, "Paper is required"),
  frameType: z.string().min(1, "Frame is required"),
  price: z.coerce.number().positive("Price must be > 0"),
  mrp: z.coerce.number().positive("MRP must be > 0"),
  stock: z.coerce.number().int().min(0),
  sku: z.string().optional(),
});

export const productImageSchema = z.object({
  url: z.string().url("Enter a valid image URL"),
  alt: z.string().optional(),
});

export const productSchema = z.object({
  name: z.string().min(2, "Name is required").max(140),
  slug: z.string().optional(),
  sku: z.string().min(2, "SKU is required"),
  description: z.string().min(10, "Add a longer description"),
  shortDescription: z.string().max(200).optional().or(z.literal("")),
  basePrice: z.coerce.number().positive("Price must be > 0"),
  mrp: z.coerce.number().positive("MRP must be > 0"),
  taxRate: z.coerce.number().min(0).max(50).default(0),
  orientation: z.enum(["PORTRAIT", "LANDSCAPE", "SQUARE"]),
  status: z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]),
  categoryId: z.string().min(1, "Pick a category"),
  theme: z.string().optional().or(z.literal("")),
  color: z.string().optional().or(z.literal("")),
  artist: z.string().optional().or(z.literal("")),
  brand: z.string().optional().or(z.literal("")),
  isFeatured: z.boolean().default(false),
  isBestSeller: z.boolean().default(false),
  isNewArrival: z.boolean().default(false),
  isTrending: z.boolean().default(false),
  isLimitedEdition: z.boolean().default(false),
  metaTitle: z.string().optional().or(z.literal("")),
  metaDescription: z.string().optional().or(z.literal("")),
  images: z.array(productImageSchema).min(1, "Add at least one image"),
  variants: z.array(variantSchema).min(1, "Add at least one variant"),
});

export type ProductFormInput = z.infer<typeof productSchema>;
export type VariantInput = z.infer<typeof variantSchema>;
