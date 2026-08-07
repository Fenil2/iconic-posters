/** Serializable product shape used by cards & rails (Decimals → numbers). */
export interface ProductCardData {
  id: string;
  name: string;
  slug: string;
  price: number;
  mrp: number;
  discountPercent: number;
  image: string;
  secondaryImage?: string;
  artist?: string | null;
  theme?: string | null;
  orientation: "PORTRAIT" | "LANDSCAPE" | "SQUARE";
  ratingAverage: number;
  ratingCount: number;
  isBestSeller: boolean;
  isNewArrival: boolean;
  isLimitedEdition: boolean;
  inStock: boolean;
}

export interface ProductImageData {
  id: string;
  url: string;
  alt: string;
}

export interface VariantData {
  id: string;
  sku: string;
  size: string;
  paperType: string;
  frameType: string;
  price: number;
  mrp: number;
  stock: number;
  isDefault: boolean;
}

export interface ReviewData {
  id: string;
  author: string;
  avatar: string | null;
  rating: number;
  title: string | null;
  comment: string;
  images: string[];
  isVerified: boolean;
  likeCount: number;
  adminReply: string | null;
  createdAt: string;
}

export interface ProductDetailData {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  shortDescription: string | null;
  basePrice: number;
  mrp: number;
  discountPercent: number;
  taxRate: number;
  orientation: "PORTRAIT" | "LANDSCAPE" | "SQUARE";
  theme: string | null;
  color: string | null;
  artist: string | null;
  brand: string | null;
  ratingAverage: number;
  ratingCount: number;
  soldCount: number;
  isLimitedEdition: boolean;
  isBestSeller: boolean;
  category: { name: string; slug: string } | null;
  images: ProductImageData[];
  variants: VariantData[];
  ratingBreakdown: Record<1 | 2 | 3 | 4 | 5, number>;
  reviews: ReviewData[];
}

export interface CategoryCardData {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  icon: string | null;
}

export interface BannerData {
  id: string;
  title: string;
  subtitle: string | null;
  /** Null when no artwork has been uploaded — render a brand backdrop instead. */
  image: string | null;
  link: string | null;
  ctaLabel: string | null;
}

export interface CartLine {
  id: string;
  productId: string;
  variantId: string | null;
  name: string;
  slug: string;
  image: string;
  size: string | null;
  paperType: string | null;
  frameType: string | null;
  unitPrice: number;
  quantity: number;
  stock: number;
  savedForLater: boolean;
}

export interface PriceBreakdown {
  subtotal: number;
  discount: number;
  shipping: number;
  tax: number;
  giftWrap: number;
  total: number;
}

export type SortOption =
  | "relevance"
  | "newest"
  | "price-asc"
  | "price-desc"
  | "rating"
  | "bestselling";

export interface ProductFilters {
  category?: string;
  collection?: string;
  q?: string;
  theme?: string[];
  color?: string[];
  size?: string[];
  frame?: string[];
  orientation?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  onSale?: boolean;
  sort?: SortOption;
  page?: number;
}
