/**
 * Central brand + site configuration for PULSE.
 * Single source of truth for identity, contact, social and legal links.
 */
export const siteConfig = {
  name: "PULSE",
  legalName: "PULSE Art Collective",
  tagline: "Curated wall art & premium posters",
  description:
    "PULSE is a premium poster gallery — museum-grade prints, framing and limited editions. Discover curated wall art that turns a room into a statement.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ogImage: "/opengraph-image",
  keywords: [
    "posters",
    "wall art",
    "prints",
    "framed art",
    "movie posters",
    "minimalist art",
    "typography posters",
    "premium prints",
  ],
  contact: {
    email: "hello@pulse.store",
    phone: "+91 90000 12345",
    supportHours: "Mon–Sat, 10am – 7pm IST",
    address: "PULSE Studio, Indiranagar, Bengaluru 560038",
  },
  social: {
    instagram: "https://instagram.com/pulse.posters",
    twitter: "https://twitter.com/pulseposters",
    pinterest: "https://pinterest.com/pulseposters",
    youtube: "https://youtube.com/@pulseposters",
  },
  shipping: {
    freeShippingThreshold: 999,
    standardFee: 79,
    codFee: 49,
  },
} as const;

export type SiteConfig = typeof siteConfig;
