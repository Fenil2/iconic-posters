/**
 * Central brand + site configuration for Iconik Posters.
 * Single source of truth for identity, contact, social and legal links.
 */
export const siteConfig = {
  name: "Iconik Posters",
  legalName: "Iconik Posters",
  tagline: "Premium posters designed to make every wall iconic",
  /** Home / default meta description. */
  description:
    "Shop premium wall posters online at Iconik Posters. Explore movie, anime, gaming, car, music and aesthetic posters with high-quality printing, secure packaging and fast shipping across India.",
  /** Long-tail SEO headline used as the home page <title>. */
  seoHeadline:
    "Buy Premium Posters Online in India | Movie, Anime, Gaming, Car & Aesthetic Wall Posters",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/opengraph-image",
  keywords: [
    "posters",
    "wall posters",
    "buy posters online india",
    "movie posters",
    "anime posters",
    "gaming posters",
    "car posters",
    "music posters",
    "aesthetic posters",
    "minimal wall art",
  ],
  contact: {
    email: "support@iconikposters.in",
    /** TODO: replace with the real business number before launch. */
    phone: "",
    supportHours: "Monday – Saturday, 10:00 AM – 7:00 PM",
    /** TODO: replace with the registered business address before launch. */
    address: "Iconik Posters, India",
  },
  social: {
    instagramHandle: "@iconikposters",
    instagram: "https://instagram.com/iconikposters",
    facebook: "https://facebook.com/iconikposters",
    youtube: "https://youtube.com/@iconikposters",
  },
  shipping: {
    freeShippingThreshold: 999,
    standardFee: 79,
    codFee: 49,
  },
} as const;

export type SiteConfig = typeof siteConfig;
