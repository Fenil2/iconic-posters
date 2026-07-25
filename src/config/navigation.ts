import type { LucideIcon } from "lucide-react";
import {
  Bike,
  Car,
  Star,
  Mountain,
  Sparkles,
  Flame,
  TrendingUp,
} from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
}

export interface MegaMenuColumn {
  title: string;
  links: NavLink[];
}

export interface MegaMenuCategory {
  label: string;
  slug: string;
  icon: LucideIcon;
  columns: MegaMenuColumn[];
  featured?: { label: string; href: string; image: string };
}

/**
 * Storefront mega-menu for the five store categories. Slugs align with the
 * seeded categories so links resolve to real listing pages; `?theme=` params
 * map to the product `theme` field used by filters.
 */
export const megaMenu: MegaMenuCategory[] = [
  {
    label: "Bikes",
    slug: "bikes",
    icon: Bike,
    columns: [
      {
        title: "By Style",
        links: [
          { label: "Superbikes", href: "/category/bikes?theme=superbike" },
          { label: "Cafe Racers", href: "/category/bikes?theme=caferacer" },
          { label: "Cruisers", href: "/category/bikes?theme=cruiser" },
          { label: "Vintage & Classic", href: "/category/bikes?theme=vintage" },
        ],
      },
      {
        title: "Racing",
        links: [
          { label: "MotoGP", href: "/category/bikes?theme=motogp" },
          { label: "Adventure & Dirt", href: "/category/bikes?theme=adventure" },
          { label: "Custom Builds", href: "/category/bikes?theme=custom" },
        ],
      },
    ],
    featured: {
      label: "New: Superbike Series",
      href: "/category/bikes?theme=superbike",
      image:
        "https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=600&q=80",
    },
  },
  {
    label: "Cars",
    slug: "cars",
    icon: Car,
    columns: [
      {
        title: "By Style",
        links: [
          { label: "Supercars", href: "/category/cars?theme=supercar" },
          { label: "JDM Legends", href: "/category/cars?theme=jdm" },
          { label: "Muscle Cars", href: "/category/cars?theme=muscle" },
          { label: "Vintage & Classic", href: "/category/cars?theme=vintage" },
        ],
      },
      {
        title: "Racing",
        links: [
          { label: "Formula 1", href: "/category/cars?theme=f1" },
          { label: "Rally", href: "/category/cars?theme=rally" },
          { label: "Concept Cars", href: "/category/cars?theme=concept" },
        ],
      },
    ],
    featured: {
      label: "Supercar Prints",
      href: "/category/cars?theme=supercar",
      image:
        "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80",
    },
  },
  {
    label: "Heroes & Heroines",
    slug: "heroes-heroines",
    icon: Star,
    columns: [
      {
        title: "Cinema",
        links: [
          { label: "Bollywood", href: "/category/heroes-heroines?theme=bollywood" },
          { label: "Hollywood", href: "/category/heroes-heroines?theme=hollywood" },
          { label: "Tollywood & Regional", href: "/category/heroes-heroines?theme=regional" },
        ],
      },
      {
        title: "Style",
        links: [
          { label: "Black & White Portraits", href: "/category/heroes-heroines?theme=bw" },
          { label: "Legends & Icons", href: "/category/heroes-heroines?theme=legends" },
          { label: "Minimal Portraits", href: "/category/heroes-heroines?theme=minimal" },
        ],
      },
    ],
    featured: {
      label: "Legends Collection",
      href: "/category/heroes-heroines?theme=legends",
      image:
        "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80",
    },
  },
  {
    label: "Nature",
    slug: "nature",
    icon: Mountain,
    columns: [
      {
        title: "Scenes",
        links: [
          { label: "Mountains", href: "/category/nature?theme=mountains" },
          { label: "Ocean & Beaches", href: "/category/nature?theme=ocean" },
          { label: "Forests", href: "/category/nature?theme=forest" },
          { label: "Sunsets", href: "/category/nature?theme=sunset" },
        ],
      },
      {
        title: "Life",
        links: [
          { label: "Wildlife", href: "/category/nature?theme=wildlife" },
          { label: "Botanical", href: "/category/nature?theme=botanical" },
          { label: "Space & Sky", href: "/category/nature?theme=sky" },
        ],
      },
    ],
    featured: {
      label: "Mountain Series",
      href: "/category/nature?theme=mountains",
      image:
        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&q=80",
    },
  },
  {
    label: "Anime",
    slug: "anime",
    icon: Sparkles,
    columns: [
      {
        title: "By Type",
        links: [
          { label: "Action & Shonen", href: "/category/anime?theme=shonen" },
          { label: "Classic Anime", href: "/category/anime?theme=classic" },
          { label: "Movie Art", href: "/category/anime?theme=movie" },
        ],
      },
      {
        title: "Style",
        links: [
          { label: "Character Portraits", href: "/category/anime?theme=characters" },
          { label: "Minimal Anime", href: "/category/anime?theme=minimal" },
          { label: "Scenery", href: "/category/anime?theme=scenery" },
        ],
      },
    ],
    featured: {
      label: "Fan-favourite Anime",
      href: "/category/anime?theme=shonen",
      image:
        "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&q=80",
    },
  },
];

/** Simple top-level links shown beside the mega-menu trigger. */
export const primaryNav: NavLink[] = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Limited Edition", href: "/collection/limited-edition" },
  { label: "Sale", href: "/sale" },
];

/** Category quick-links (home rail + mobile drawer). */
export const categoryIcons: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "Bikes", href: "/category/bikes", icon: Bike },
  { label: "Cars", href: "/category/cars", icon: Car },
  { label: "Heroes & Heroines", href: "/category/heroes-heroines", icon: Star },
  { label: "Nature", href: "/category/nature", icon: Mountain },
  { label: "Anime", href: "/category/anime", icon: Sparkles },
  { label: "New Arrivals", href: "/new-arrivals", icon: Sparkles },
  { label: "Best Sellers", href: "/best-sellers", icon: TrendingUp },
  { label: "Sale", href: "/sale", icon: Flame },
];

export const popularSearches = [
  "Superbike",
  "Ducati",
  "JDM",
  "Formula 1",
  "Bollywood legends",
  "Mountains",
  "Naruto",
  "Anime minimal",
];

/** Customer account navigation. */
export const accountNav: NavLink[] = [
  { label: "Dashboard", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Wishlist", href: "/account/wishlist" },
  { label: "Addresses", href: "/account/addresses" },
  { label: "Downloads", href: "/account/downloads" },
  { label: "Notifications", href: "/account/notifications" },
  { label: "Settings", href: "/account/settings" },
];
