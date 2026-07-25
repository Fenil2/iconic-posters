/**
 * Iconik Posters — database seed.
 * Idempotent-ish seed: clears catalog/marketing tables and repopulates with a
 * realistic premium-poster catalogue, an admin user, coupons, banners, etc.
 *
 * Run with:  pnpm db:seed   (after `pnpm db:push` against a real DATABASE_URL)
 */
import { PrismaClient, Orientation, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const UNSPLASH = (id: string, w = 800) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

const SIZES = ["A4", "A3", "18x24", "24x36"] as const;
const PAPERS = ["Matte", "Glossy", "Canvas"] as const;
const FRAMES = ["None", "Black Wood", "Natural Oak", "White Metal"] as const;

const PAPER_DELTA: Record<string, number> = { Matte: 0, Glossy: 150, Canvas: 400 };
const SIZE_MULTIPLIER: Record<string, number> = {
  A4: 1,
  A3: 1.4,
  "18x24": 1.8,
  "24x36": 2.4,
};
const FRAME_DELTA: Record<string, number> = {
  None: 0,
  "Black Wood": 700,
  "Natural Oak": 900,
  "White Metal": 800,
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Store collections. Slugs must stay in sync with `storeCollections` in
 * src/config/navigation.ts — the home grid and /collections link straight here.
 */
const categories = [
  { name: "Movies", slug: "movies", icon: "Clapperboard", image: UNSPLASH("1489599849927-2ee91cede3ba") },
  { name: "Gaming", slug: "gaming", icon: "Gamepad2", image: UNSPLASH("1542751371-adc38448a05e") },
  { name: "Anime", slug: "anime", icon: "Sparkles", image: UNSPLASH("1578632767115-351597cf2477") },
  { name: "Cars & Bikes", slug: "cars-bikes", icon: "Car", image: UNSPLASH("1503376780353-7e6692767b70") },
  { name: "Music", slug: "music", icon: "Music4", image: UNSPLASH("1511671782779-c97d3d27a1d4") },
  { name: "Quotes", slug: "quotes", icon: "Quote", image: UNSPLASH("1455390582262-044cdead277a") },
  { name: "Love", slug: "love", icon: "Heart", image: UNSPLASH("1518199266791-5375a83190b7") },
  { name: "Aesthetic", slug: "aesthetic", icon: "Sparkle", image: UNSPLASH("1502691876148-a84978e59af8") },
  { name: "Space", slug: "space", icon: "Rocket", image: UNSPLASH("1462331940025-496dfbfc7564") },
  { name: "Sports", slug: "sports", icon: "Trophy", image: UNSPLASH("1461896836934-ffe607ba8211") },
  { name: "Minimal", slug: "minimal", icon: "Shapes", image: UNSPLASH("1497366216548-37526070297c") },
];

const collections = [
  { name: "Limited Edition", slug: "limited-edition", featured: true },
  { name: "New Arrivals", slug: "new-arrivals", featured: true },
  { name: "Best Sellers", slug: "bestsellers", featured: true },
  { name: "Framed & Ready", slug: "framed-ready", featured: false },
];

// Curated product blueprints across every collection.
const productBlueprints: {
  name: string;
  category: string;
  theme: string;
  color: string;
  artist: string;
  price: number;
  photo: string;
  flags?: Partial<{
    isFeatured: boolean;
    isBestSeller: boolean;
    isNewArrival: boolean;
    isTrending: boolean;
    isLimitedEdition: boolean;
  }>;
  collection?: string;
}[] = [
  // Movies
  { name: "Silver Screen — Reel Nights", category: "movies", theme: "classic", color: "black", artist: "Cult Classics", price: 849, photo: "1489599849927-2ee91cede3ba", flags: { isFeatured: true, isBestSeller: true, isTrending: true }, collection: "bestsellers" },
  { name: "Projection Room — 35mm", category: "movies", theme: "bw", color: "black", artist: "Cinema", price: 799, photo: "1440404653325-ab127d49abc1", flags: { isLimitedEdition: true }, collection: "limited-edition" },
  { name: "Leading Role — Golden Era", category: "movies", theme: "portrait", color: "beige", artist: "Portraits", price: 799, photo: "1516035069371-29a1b244cc32", flags: { isTrending: true } },

  // Gaming
  { name: "Battlestation — Neon Rig", category: "gaming", theme: "neon", color: "purple", artist: "Neon", price: 899, photo: "1542751371-adc38448a05e", flags: { isFeatured: true, isBestSeller: true }, collection: "bestsellers" },
  { name: "Insert Coin — Arcade Era", category: "gaming", theme: "retro", color: "red", artist: "Retro", price: 749, photo: "1550745165-9bc0b252726f", flags: { isTrending: true } },
  { name: "Respawn — Controller Study", category: "gaming", theme: "minimal", color: "black", artist: "Minimal", price: 699, photo: "1596727147705-61a532a659bd", flags: { isNewArrival: true }, collection: "new-arrivals" },

  // Anime
  { name: "Shonen — Rising Spirit", category: "anime", theme: "shonen", color: "orange", artist: "Shonen", price: 749, photo: "1578632767115-351597cf2477", flags: { isFeatured: true, isBestSeller: true, isTrending: true }, collection: "bestsellers" },
  { name: "Classic Anime — Neon City", category: "anime", theme: "classic", color: "purple", artist: "Classic", price: 799, photo: "1607604276583-eef5d076aa5f", flags: { isLimitedEdition: true }, collection: "limited-edition" },
  { name: "Minimal Anime — Quiet Frame", category: "anime", theme: "minimal", color: "black", artist: "Minimal", price: 599, photo: "1560972550-aba3456b5564", flags: { isNewArrival: true }, collection: "new-arrivals" },

  // Cars & Bikes
  { name: "Supercar — Midnight Coupe", category: "cars-bikes", theme: "supercar", color: "black", artist: "Supercar", price: 999, photo: "1503376780353-7e6692767b70", flags: { isFeatured: true, isBestSeller: true }, collection: "bestsellers" },
  { name: "Superbike — Apex Red", category: "cars-bikes", theme: "superbike", color: "red", artist: "Superbike", price: 899, photo: "1568772585407-9361f9bf3a87", flags: { isTrending: true } },
  { name: "Formula 1 — Pole Position", category: "cars-bikes", theme: "f1", color: "red", artist: "Formula 1", price: 949, photo: "1541443131876-44b03de101c5", flags: { isNewArrival: true, isTrending: true }, collection: "new-arrivals" },
  { name: "JDM Legend — Neon Drift", category: "cars-bikes", theme: "jdm", color: "blue", artist: "JDM", price: 899, photo: "1544829099-b9a0c07fad1a", flags: { isLimitedEdition: true }, collection: "limited-edition" },

  // Music
  { name: "Headphone Hours", category: "music", theme: "studio", color: "black", artist: "Studio", price: 699, photo: "1511671782779-c97d3d27a1d4", flags: { isFeatured: true } },
  { name: "Front Row — Stage Lights", category: "music", theme: "live", color: "purple", artist: "Live", price: 799, photo: "1470225620780-dba8ba36b745", flags: { isBestSeller: true, isTrending: true }, collection: "bestsellers" },
  { name: "Vinyl Sundays", category: "music", theme: "vinyl", color: "beige", artist: "Vinyl", price: 649, photo: "1493225457124-a3eb161ffa5f", flags: { isNewArrival: true }, collection: "new-arrivals" },

  // Quotes
  { name: "Do It Anyway — Typeset", category: "quotes", theme: "typography", color: "black", artist: "Typography", price: 549, photo: "1455390582262-044cdead277a", flags: { isBestSeller: true }, collection: "bestsellers" },
  { name: "Stay Weird — Neon Script", category: "quotes", theme: "neon", color: "orange", artist: "Neon", price: 649, photo: "1519682337058-a94d519337bc", flags: { isTrending: true } },
  { name: "One Line at a Time", category: "quotes", theme: "minimal", color: "beige", artist: "Minimal", price: 499, photo: "1487956382158-bb926046304a", flags: { isNewArrival: true }, collection: "new-arrivals" },

  // Love
  { name: "Us — Warm Light", category: "love", theme: "romantic", color: "red", artist: "Romantic", price: 599, photo: "1518199266791-5375a83190b7", flags: { isFeatured: true } },
  { name: "Held — Paper Hearts", category: "love", theme: "minimal", color: "red", artist: "Minimal", price: 549, photo: "1494774157365-9e04c6720e47", flags: { isNewArrival: true }, collection: "new-arrivals" },

  // Aesthetic
  { name: "Golden Hour Interior", category: "aesthetic", theme: "warm", color: "beige", artist: "Warm", price: 699, photo: "1502691876148-a84978e59af8", flags: { isFeatured: true, isBestSeller: true }, collection: "bestsellers" },
  { name: "Pastel Mood — Soft Frame", category: "aesthetic", theme: "pastel", color: "purple", artist: "Pastel", price: 649, photo: "1554188248-986adbb73be4", flags: { isTrending: true } },
  { name: "After Dark — Moody Study", category: "aesthetic", theme: "dark", color: "black", artist: "Dark", price: 749, photo: "1533174072545-7a4b6ad7a6c3", flags: { isLimitedEdition: true }, collection: "limited-edition" },

  // Space
  { name: "Deep Field — Galaxy Print", category: "space", theme: "galaxy", color: "purple", artist: "Galaxy", price: 799, photo: "1462331940025-496dfbfc7564", flags: { isFeatured: true, isTrending: true } },
  { name: "Orbit — Mission Log", category: "space", theme: "mission", color: "blue", artist: "Mission", price: 849, photo: "1543722530-d2c3201371e7", flags: { isBestSeller: true }, collection: "bestsellers" },
  { name: "Night Sky — Long Exposure", category: "space", theme: "stars", color: "blue", artist: "Stars", price: 699, photo: "1470813740244-df37b8c1edcb", flags: { isNewArrival: true }, collection: "new-arrivals" },

  // Sports
  { name: "Full House — Stadium Lights", category: "sports", theme: "stadium", color: "green", artist: "Stadium", price: 799, photo: "1461896836934-ffe607ba8211", flags: { isFeatured: true, isTrending: true } },
  { name: "Matchday — Final Whistle", category: "sports", theme: "football", color: "green", artist: "Football", price: 749, photo: "1517649763962-0c623066013b", flags: { isBestSeller: true }, collection: "bestsellers" },
  { name: "Court Vision", category: "sports", theme: "basketball", color: "orange", artist: "Basketball", price: 749, photo: "1526379095098-d400fd0bf935", flags: { isNewArrival: true }, collection: "new-arrivals" },

  // Minimal
  { name: "Two Shapes", category: "minimal", theme: "shapes", color: "beige", artist: "Shapes", price: 499, photo: "1497366216548-37526070297c", flags: { isBestSeller: true }, collection: "bestsellers" },
  { name: "Line Study — Single Stroke", category: "minimal", theme: "lineart", color: "black", artist: "Line Art", price: 549, photo: "1513519245088-0e12902e5a38", flags: { isTrending: true } },
  { name: "Negative Space", category: "minimal", theme: "monochrome", color: "black", artist: "Monochrome", price: 599, photo: "1531297484001-80022131f5a1", flags: { isNewArrival: true, isLimitedEdition: true }, collection: "limited-edition" },
];

async function main() {
  console.log("🌱  Seeding Iconik Posters database…");

  // Clean (respect FK order)
  await prisma.productVariant.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.productCategory.deleteMany();
  await prisma.productCollection.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.banner.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.faq.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.shippingZone.deleteMany();
  await prisma.setting.deleteMany();

  // Admin user
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@iconikposters.in";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin@12345";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: Role.SUPER_ADMIN, name: "Iconik Admin" },
    create: {
      email: adminEmail,
      name: "Iconik Admin",
      role: Role.SUPER_ADMIN,
      passwordHash: await bcrypt.hash(adminPassword, 12),
      emailVerified: new Date(),
    },
  });
  console.log(`   ✔ admin: ${adminEmail}`);

  // Categories
  const categoryMap = new Map<string, string>();
  for (const [i, c] of categories.entries()) {
    const created = await prisma.category.create({
      data: {
        name: c.name,
        slug: c.slug,
        icon: c.icon,
        image: c.image,
        isFeatured: i < 6,
        position: i,
        description: `Premium ${c.name.toLowerCase()} posters — high-quality printing, multiple sizes and framing options.`,
      },
    });
    categoryMap.set(c.slug, created.id);
  }
  console.log(`   ✔ ${categories.length} categories`);

  // Collections
  const collectionMap = new Map<string, string>();
  for (const [i, col] of collections.entries()) {
    const created = await prisma.collection.create({
      data: {
        name: col.name,
        slug: col.slug,
        isFeatured: col.featured,
        position: i,
        description: `${col.name} — hand-picked by the Iconik Posters team.`,
      },
    });
    collectionMap.set(col.slug, created.id);
  }
  console.log(`   ✔ ${collections.length} collections`);

  // Products + images + categories, then all variants in one batched insert.
  const variantRows: {
    productId: string;
    sku: string;
    size: string;
    paperType: string;
    frameType: string;
    price: number;
    mrp: number;
    stock: number;
    isDefault: boolean;
    weightGram: number;
  }[] = [];

  for (const [i, bp] of productBlueprints.entries()) {
    const slug = slugify(bp.name);
    const mrp = Math.round(bp.price * 1.6);
    const orientation =
      i % 5 === 0
        ? Orientation.LANDSCAPE
        : i % 7 === 0
          ? Orientation.SQUARE
          : Orientation.PORTRAIT;

    const product = await prisma.product.create({
      data: {
        name: bp.name,
        slug,
        sku: `IKP-${String(i + 1).padStart(4, "0")}`,
        description: `${bp.name} is part of the Iconik Posters ${bp.artist} series. Printed on premium, fade-resistant stock for vibrant colour and sharp detail that lasts, and shipped in protective rigid packaging.`,
        shortDescription: `Premium ${bp.artist} print by Iconik Posters.`,
        basePrice: bp.price,
        mrp,
        taxRate: 12,
        orientation,
        theme: bp.theme,
        color: bp.color,
        artist: bp.artist,
        brand: "Iconik Posters",
        ratingAverage: Math.min(5, Number((4 + Math.random()).toFixed(1))),
        ratingCount: Math.floor(20 + Math.random() * 400),
        soldCount: Math.floor(50 + Math.random() * 900),
        viewCount: Math.floor(500 + Math.random() * 9000),
        isFeatured: bp.flags?.isFeatured ?? false,
        isBestSeller: bp.flags?.isBestSeller ?? false,
        isNewArrival: bp.flags?.isNewArrival ?? false,
        isTrending: bp.flags?.isTrending ?? false,
        isLimitedEdition: bp.flags?.isLimitedEdition ?? false,
        metaTitle: `${bp.name} | Iconik Posters`,
        metaDescription: `Buy ${bp.name} — premium ${bp.theme} wall poster. Multiple sizes, framing options and fast shipping across India.`,
        images: {
          create: [
            { url: UNSPLASH(bp.photo, 900), alt: bp.name, position: 0, isPrimary: true },
            { url: UNSPLASH(bp.photo, 600), alt: `${bp.name} detail`, position: 1 },
          ],
        },
        categories: { create: [{ categoryId: categoryMap.get(bp.category)! }] },
        collections: bp.collection
          ? { create: [{ collectionId: collectionMap.get(bp.collection)! }] }
          : undefined,
      },
    });

    // Variants — cartesian of a curated subset to keep counts sane
    let variantIndex = 0;
    for (const size of SIZES) {
      for (const paper of PAPERS) {
        for (const frame of FRAMES.slice(0, 2)) {
          const price = Math.round(
            bp.price * SIZE_MULTIPLIER[size] +
              PAPER_DELTA[paper] +
              FRAME_DELTA[frame],
          );
          variantRows.push({
            productId: product.id,
            sku: `${product.sku}-${size}-${paper[0]}${frame === "None" ? "N" : "F"}`.toUpperCase(),
            size,
            paperType: paper,
            frameType: frame,
            price,
            mrp: Math.round(price * 1.6),
            stock: Math.floor(5 + Math.random() * 60),
            isDefault: variantIndex === 0,
            weightGram: frame === "None" ? 200 : 900,
          });
          variantIndex++;
        }
      }
    }
  }

  await prisma.productVariant.createMany({ data: variantRows });
  console.log(
    `   ✔ ${productBlueprints.length} products, ${variantRows.length} variants & images`,
  );

  // Banners
  await prisma.banner.createMany({
    data: [
      { title: "Movie Wall", subtitle: "Cult classics and blockbuster art.", image: UNSPLASH("1489599849927-2ee91cede3ba", 1600), ctaLabel: "Shop Movies", link: "/category/movies", position: "HERO", sortOrder: 0 },
      { title: "Level Up Your Setup", subtitle: "Gaming posters built for the battlestation.", image: UNSPLASH("1542751371-adc38448a05e", 1600), ctaLabel: "Shop Gaming", link: "/category/gaming", position: "HERO", sortOrder: 1 },
      { title: "Anime, Reimagined", subtitle: "Bold character art & minimal scenes for your wall.", image: UNSPLASH("1578632767115-351597cf2477", 1600), ctaLabel: "Shop Anime", link: "/category/anime", position: "HERO", sortOrder: 2 },
      { title: "Machines & Legends", subtitle: "Supercars, superbikes and racing greats.", image: UNSPLASH("1503376780353-7e6692767b70", 1600), ctaLabel: "Shop Cars & Bikes", link: "/category/cars-bikes", position: "HERO", sortOrder: 3 },
      { title: "Free framing above ₹2,499", subtitle: "This week only.", image: UNSPLASH("1524169358666-79f22534bc6e", 1200), ctaLabel: "Shop the sale", link: "/sale", position: "OFFER", sortOrder: 0 },
    ],
  });
  console.log("   ✔ banners");

  // Coupons
  await prisma.coupon.createMany({
    data: [
      { code: "ICONIK10", description: "10% off your first order", type: "PERCENTAGE", value: 10, minPurchase: 999, maxDiscount: 500, usageLimit: 1000, perUserLimit: 1, isActive: true },
      { code: "FLAT200", description: "₹200 off above ₹1499", type: "FLAT", value: 200, minPurchase: 1499, usageLimit: 500, isActive: true },
      { code: "FREESHIP", description: "Free shipping, no minimum", type: "FREE_SHIPPING", value: 0, isActive: true },
    ],
  });
  console.log("   ✔ coupons");

  // FAQs
  await prisma.faq.createMany({
    data: [
      { question: "Do you ship across India?", answer: "Yes. We deliver across India.", category: "Shipping", position: 0 },
      { question: "How long does shipping take?", answer: "Orders are usually delivered within 3–7 business days depending on your location.", category: "Shipping", position: 1 },
      { question: "Are the posters framed?", answer: "We offer both framed and unframed options, depending on the product.", category: "Products", position: 2 },
      { question: "What sizes are available?", answer: "Multiple sizes are available. Please check the product page for details.", category: "Products", position: 3 },
      { question: "Is Cash on Delivery available?", answer: "Availability depends on your location.", category: "Payments", position: 4 },
      { question: "How can I track my order?", answer: "You'll receive tracking details once your order is shipped.", category: "Orders", position: 5 },
    ],
  });
  console.log("   ✔ faqs");

  // Blog
  await prisma.blog.createMany({
    data: [
      { title: "How to build a gallery wall that actually works", slug: "gallery-wall-guide", excerpt: "A guide to spacing, framing and hanging like a pro.", content: "Start with an anchor piece…", coverImage: UNSPLASH("1513519245088-0e12902e5a38", 1200), tags: ["guides", "framing"], category: "Guides", isPublished: true, publishedAt: new Date() },
      { title: "Poster ideas for your gaming room", slug: "gaming-room-poster-ideas", excerpt: "Turn a plain setup into a battlestation worth showing off.", content: "Pick a hero print, build the palette around it…", coverImage: UNSPLASH("1542751371-adc38448a05e", 1200), tags: ["guides", "gaming"], category: "Guides", isPublished: true, publishedAt: new Date() },
    ],
  });
  console.log("   ✔ blog posts");

  // Shipping zones
  await prisma.shippingZone.createMany({
    data: [
      { name: "Metro", pincodePrefix: "56", fee: 49, freeAbove: 999, etaDaysMin: 3, etaDaysMax: 5 },
      { name: "Metro", pincodePrefix: "40", fee: 49, freeAbove: 999, etaDaysMin: 3, etaDaysMax: 5 },
      { name: "Metro", pincodePrefix: "11", fee: 49, freeAbove: 999, etaDaysMin: 3, etaDaysMax: 5 },
      { name: "Rest of India", pincodePrefix: null, fee: 79, freeAbove: 1499, etaDaysMin: 4, etaDaysMax: 7 },
    ],
  });
  console.log("   ✔ shipping zones");

  // Settings
  await prisma.setting.createMany({
    data: [
      { key: "store", value: { currency: "INR", codEnabled: true, giftWrapFee: 49 } },
      { key: "announcement", value: { text: "Fast shipping across India · Secure packaging · New designs added regularly", enabled: true } },
    ],
  });
  console.log("   ✔ settings");

  console.log("✅  Seed complete.");
}

main()
  .catch((e) => {
    console.error("❌  Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
