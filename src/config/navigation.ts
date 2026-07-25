import type { IconType } from "@/components/icons";
import {
  Clapperboard,
  Gamepad2,
  Bolt,
  Car,
  Music4,
  Quote,
  Heart,
  Sparkles,
  Rocket,
  Trophy,
  Shapes,
  Flame,
  TrendingUp,
} from "@/components/icons";

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
  icon: IconType;
  columns: MegaMenuColumn[];
  featured?: { label: string; href: string; image: string };
}

const UNSPLASH = (id: string, w = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

export interface StoreCollection {
  label: string;
  slug: string;
  icon: IconType;
  image: string;
  blurb: string;
}

/**
 * The full Iconik Posters collection set. Slugs align 1:1 with the seeded
 * categories so every tile resolves to a real `/category/[slug]` listing.
 * Used by the home "Shop By Collection" grid and the `/collections` index.
 */
export const storeCollections: StoreCollection[] = [
  {
    label: "Movies",
    slug: "movies",
    icon: Clapperboard,
    image: UNSPLASH("1489599849927-2ee91cede3ba"),
    blurb: "Cult classics, blockbusters and silver-screen icons.",
  },
  {
    label: "Gaming",
    slug: "gaming",
    icon: Gamepad2,
    image: UNSPLASH("1542751371-adc38448a05e"),
    blurb: "Legendary titles and setup-defining art for your battlestation.",
  },
  {
    label: "Anime",
    slug: "anime",
    icon: Bolt,
    image: UNSPLASH("1578632767115-351597cf2477"),
    blurb: "Bold character art, iconic scenes and minimal anime prints.",
  },
  {
    label: "Cars & Bikes",
    slug: "cars-bikes",
    icon: Car,
    image: UNSPLASH("1503376780353-7e6692767b70"),
    blurb: "Supercars, JDM legends, superbikes and racing greats.",
  },
  {
    label: "Music",
    slug: "music",
    icon: Music4,
    image: UNSPLASH("1511671782779-c97d3d27a1d4"),
    blurb: "Album art, tour posters and legends of every genre.",
  },
  {
    label: "Quotes",
    slug: "quotes",
    icon: Quote,
    image: UNSPLASH("1455390582262-044cdead277a"),
    blurb: "Typography that says exactly what you needed to hear.",
  },
  {
    label: "Love",
    slug: "love",
    icon: Heart,
    image: UNSPLASH("1518199266791-5375a83190b7"),
    blurb: "Warm, romantic prints for shared spaces and gifting.",
  },
  {
    label: "Aesthetic",
    slug: "aesthetic",
    icon: Sparkles,
    image: UNSPLASH("1502691876148-a84978e59af8"),
    blurb: "Mood-led art for interiors that photograph beautifully.",
  },
  {
    label: "Space",
    slug: "space",
    icon: Rocket,
    image: UNSPLASH("1462331940025-496dfbfc7564"),
    blurb: "Galaxies, missions and the quiet enormity of it all.",
  },
  {
    label: "Sports",
    slug: "sports",
    icon: Trophy,
    image: UNSPLASH("1461896836934-ffe607ba8211"),
    blurb: "Match-defining moments and the athletes who made them.",
  },
  {
    label: "Minimal",
    slug: "minimal",
    icon: Shapes,
    image: UNSPLASH("1497366216548-37526070297c"),
    blurb: "Line art, shapes and restraint — for walls that whisper.",
  },
];

/**
 * Storefront mega-menu. Only the headline collections get a dropdown so the
 * desktop bar stays readable; the rest live in the home grid and
 * `/collections`. `?theme=` params map to the product `theme` field.
 */
export const megaMenu: MegaMenuCategory[] = [
  {
    label: "Movies",
    slug: "movies",
    icon: Clapperboard,
    columns: [
      {
        title: "By Genre",
        links: [
          { label: "Action & Thriller", href: "/category/movies?theme=action" },
          { label: "Sci-Fi & Fantasy", href: "/category/movies?theme=scifi" },
          { label: "Cult Classics", href: "/category/movies?theme=classic" },
          { label: "Bollywood", href: "/category/movies?theme=bollywood" },
        ],
      },
      {
        title: "By Style",
        links: [
          { label: "Character Portraits", href: "/category/movies?theme=portrait" },
          { label: "Minimal Movie Art", href: "/category/movies?theme=minimal" },
          { label: "Black & White", href: "/category/movies?theme=bw" },
        ],
      },
    ],
    featured: {
      label: "Cult Classics Series",
      href: "/category/movies?theme=classic",
      image: UNSPLASH("1489599849927-2ee91cede3ba"),
    },
  },
  {
    label: "Gaming",
    slug: "gaming",
    icon: Gamepad2,
    columns: [
      {
        title: "By Type",
        links: [
          { label: "Open World", href: "/category/gaming?theme=openworld" },
          { label: "Shooters & FPS", href: "/category/gaming?theme=fps" },
          { label: "Retro & Arcade", href: "/category/gaming?theme=retro" },
        ],
      },
      {
        title: "For Your Setup",
        links: [
          { label: "Neon & Cyberpunk", href: "/category/gaming?theme=neon" },
          { label: "Esports", href: "/category/gaming?theme=esports" },
          { label: "Minimal Gaming", href: "/category/gaming?theme=minimal" },
        ],
      },
    ],
    featured: {
      label: "Battlestation Picks",
      href: "/category/gaming?theme=neon",
      image: UNSPLASH("1542751371-adc38448a05e"),
    },
  },
  {
    label: "Anime",
    slug: "anime",
    icon: Bolt,
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
      image: UNSPLASH("1578632767115-351597cf2477"),
    },
  },
  {
    label: "Cars & Bikes",
    slug: "cars-bikes",
    icon: Car,
    columns: [
      {
        title: "Cars",
        links: [
          { label: "Supercars", href: "/category/cars-bikes?theme=supercar" },
          { label: "JDM Legends", href: "/category/cars-bikes?theme=jdm" },
          { label: "Muscle Cars", href: "/category/cars-bikes?theme=muscle" },
          { label: "Formula 1", href: "/category/cars-bikes?theme=f1" },
        ],
      },
      {
        title: "Bikes",
        links: [
          { label: "Superbikes", href: "/category/cars-bikes?theme=superbike" },
          { label: "Cafe Racers", href: "/category/cars-bikes?theme=caferacer" },
          { label: "MotoGP", href: "/category/cars-bikes?theme=motogp" },
        ],
      },
    ],
    featured: {
      label: "Garage Wall Series",
      href: "/category/cars-bikes?theme=supercar",
      image: UNSPLASH("1503376780353-7e6692767b70"),
    },
  },
  {
    label: "Aesthetic",
    slug: "aesthetic",
    icon: Sparkles,
    columns: [
      {
        title: "Moods",
        links: [
          { label: "Warm & Earthy", href: "/category/aesthetic?theme=warm" },
          { label: "Pastel", href: "/category/aesthetic?theme=pastel" },
          { label: "Dark & Moody", href: "/category/aesthetic?theme=dark" },
        ],
      },
      {
        title: "More",
        links: [
          { label: "Quotes", href: "/category/quotes" },
          { label: "Love", href: "/category/love" },
          { label: "Minimal", href: "/category/minimal" },
        ],
      },
    ],
    featured: {
      label: "Interior-ready Prints",
      href: "/category/aesthetic?theme=warm",
      image: UNSPLASH("1502691876148-a84978e59af8"),
    },
  },
];

/** Simple top-level links shown beside the mega-menu trigger. */
export const primaryNav: NavLink[] = [
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Collections", href: "/collections" },
  { label: "Sale", href: "/sale" },
];

/** Category quick-links (home rail + mobile drawer). */
export const categoryIcons: { label: string; href: string; icon: IconType }[] = [
  ...storeCollections.map((c) => ({
    label: c.label,
    href: `/category/${c.slug}`,
    icon: c.icon,
  })),
  { label: "New Arrivals", href: "/new-arrivals", icon: Sparkles },
  { label: "Best Sellers", href: "/best-sellers", icon: TrendingUp },
  { label: "Sale", href: "/sale", icon: Flame },
];

export const popularSearches = [
  "Movie posters",
  "Anime",
  "Gaming setup",
  "Supercar",
  "Formula 1",
  "Music album art",
  "Aesthetic",
  "Minimal line art",
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
