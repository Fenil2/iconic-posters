/**
 * PULSE — database seed.
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

// The five store categories. (Single-seller store — the admin uploads all art.)
const categories = [
  { name: "Bikes", slug: "bikes", icon: "Bike", image: UNSPLASH("1568772585407-9361f9bf3a87") },
  { name: "Cars", slug: "cars", icon: "Car", image: UNSPLASH("1503376780353-7e6692767b70") },
  { name: "Heroes & Heroines", slug: "heroes-heroines", icon: "Star", image: UNSPLASH("1516035069371-29a1b244cc32") },
  { name: "Nature", slug: "nature", icon: "Mountain", image: UNSPLASH("1470071459604-3b5ec3a7fe05") },
  { name: "Anime", slug: "anime", icon: "Sparkles", image: UNSPLASH("1578632767115-351597cf2477") },
];

const collections = [
  { name: "Limited Edition", slug: "limited-edition", featured: true },
  { name: "New Arrivals", slug: "new-arrivals", featured: true },
  { name: "Best Sellers", slug: "bestsellers", featured: true },
  { name: "Framed & Ready", slug: "framed-ready", featured: false },
];

// Curated product blueprints across categories.
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
  // Bikes
  { name: "Superbike — Apex Red", category: "bikes", theme: "superbike", color: "red", artist: "Superbike", price: 899, photo: "1568772585407-9361f9bf3a87", flags: { isFeatured: true, isTrending: true, isBestSeller: true }, collection: "bestsellers" },
  { name: "Cafe Racer — Chrome & Oil", category: "bikes", theme: "caferacer", color: "black", artist: "Cafe Racer", price: 749, photo: "1558981403-c5f9899a28bc", flags: { isBestSeller: true } },
  { name: "MotoGP — Full Lean", category: "bikes", theme: "motogp", color: "blue", artist: "MotoGP", price: 849, photo: "1547549082-6bc09f2049ae", flags: { isTrending: true }, collection: "limited-edition" },
  { name: "Classic Cruiser — Route 66", category: "bikes", theme: "cruiser", color: "orange", artist: "Cruiser", price: 699, photo: "1449426468159-d96dbf395be9", flags: { isNewArrival: true }, collection: "new-arrivals" },

  // Cars
  { name: "Supercar — Midnight Coupe", category: "cars", theme: "supercar", color: "black", artist: "Supercar", price: 999, photo: "1503376780353-7e6692767b70", flags: { isFeatured: true, isBestSeller: true }, collection: "bestsellers" },
  { name: "JDM Legend — Neon Drift", category: "cars", theme: "jdm", color: "blue", artist: "JDM", price: 899, photo: "1544829099-b9a0c07fad1a", flags: { isTrending: true }, collection: "limited-edition" },
  { name: "Muscle — American V8", category: "cars", theme: "muscle", color: "red", artist: "Muscle", price: 799, photo: "1552519507-da3b142c6e3d", flags: {} },
  { name: "Formula 1 — Pole Position", category: "cars", theme: "f1", color: "red", artist: "Formula 1", price: 949, photo: "1541443131876-44b03de101c5", flags: { isNewArrival: true, isTrending: true }, collection: "new-arrivals" },

  // Heroes & Heroines
  { name: "Silver Screen — Icon Portrait", category: "heroes-heroines", theme: "legends", color: "beige", artist: "Legends", price: 849, photo: "1516035069371-29a1b244cc32", flags: { isFeatured: true, isBestSeller: true }, collection: "bestsellers" },
  { name: "Spotlight — B&W Legend", category: "heroes-heroines", theme: "bw", color: "black", artist: "B&W Portrait", price: 749, photo: "1507003211169-0a1dd7228f2d", flags: { isLimitedEdition: true }, collection: "limited-edition" },
  { name: "Leading Lady — Golden Era", category: "heroes-heroines", theme: "bollywood", color: "orange", artist: "Bollywood", price: 799, photo: "1492288991661-058aa541ff43", flags: { isTrending: true } },

  // Nature
  { name: "Golden Hour Ridge", category: "nature", theme: "mountains", color: "beige", artist: "Mountains", price: 649, photo: "1470071459604-3b5ec3a7fe05", flags: { isFeatured: true } },
  { name: "Ocean Fade", category: "nature", theme: "ocean", color: "blue", artist: "Ocean", price: 659, photo: "1505142468610-359e7d316be0", flags: { isBestSeller: true } },
  { name: "Deep Forest — First Light", category: "nature", theme: "forest", color: "green", artist: "Forest", price: 629, photo: "1441974231531-c6227db76b6e", flags: { isNewArrival: true }, collection: "new-arrivals" },
  { name: "Wild — Amber Eyes", category: "nature", theme: "wildlife", color: "orange", artist: "Wildlife", price: 699, photo: "1474511320723-9a56873867b5", flags: { isTrending: true } },

  // Anime
  { name: "Shonen — Rising Spirit", category: "anime", theme: "shonen", color: "orange", artist: "Shonen", price: 749, photo: "1578632767115-351597cf2477", flags: { isFeatured: true, isTrending: true, isBestSeller: true }, collection: "bestsellers" },
  { name: "Classic Anime — Neon City", category: "anime", theme: "classic", color: "purple", artist: "Classic", price: 799, photo: "1607604276583-eef5d076aa5f", flags: { isLimitedEdition: true }, collection: "limited-edition" },
  { name: "Minimal Anime — Quiet Frame", category: "anime", theme: "minimal", color: "black", artist: "Minimal", price: 599, photo: "1560972550-aba3456b5564", flags: { isNewArrival: true }, collection: "new-arrivals" },
];

async function main() {
  console.log("🌱  Seeding PULSE database…");

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
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? "admin@pulse.store";
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? "Admin@12345";
  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: "PULSE Admin",
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
        isFeatured: i < 4,
        position: i,
        description: `Premium ${c.name.toLowerCase()} posters, museum-grade prints and framing.`,
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
        description: `${col.name} — hand-picked by the PULSE curators.`,
      },
    });
    collectionMap.set(col.slug, created.id);
  }
  console.log(`   ✔ ${collections.length} collections`);

  // Products + variants + images
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
        sku: `PLS-${String(i + 1).padStart(4, "0")}`,
        description: `${bp.name} is a limited-run giclée print by ${bp.artist}. Printed on archival, acid-free stock with fade-resistant pigment inks for gallery-grade depth and longevity. Each piece ships in protective rigid packaging.`,
        shortDescription: `Archival giclée print by ${bp.artist}.`,
        basePrice: bp.price,
        mrp,
        taxRate: 12,
        orientation,
        theme: bp.theme,
        color: bp.color,
        artist: bp.artist,
        brand: "PULSE",
        ratingAverage: Number((4 + Math.random()).toFixed(1)) > 5 ? 5 : Number((4 + Math.random()).toFixed(1)),
        ratingCount: Math.floor(20 + Math.random() * 400),
        soldCount: Math.floor(50 + Math.random() * 900),
        viewCount: Math.floor(500 + Math.random() * 9000),
        isFeatured: bp.flags?.isFeatured ?? false,
        isBestSeller: bp.flags?.isBestSeller ?? false,
        isNewArrival: bp.flags?.isNewArrival ?? false,
        isTrending: bp.flags?.isTrending ?? false,
        isLimitedEdition: bp.flags?.isLimitedEdition ?? false,
        metaTitle: `${bp.name} | PULSE Posters`,
        metaDescription: `Buy ${bp.name} — premium ${bp.theme} poster by ${bp.artist}. Archival print, multiple sizes & framing.`,
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
          await prisma.productVariant.create({
            data: {
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
            },
          });
          variantIndex++;
        }
      }
    }
  }
  console.log(`   ✔ ${productBlueprints.length} products with variants & images`);

  // Banners
  await prisma.banner.createMany({
    data: [
      { title: "Ride the Redline", subtitle: "Superbike & MotoGP prints for the speed obsessed.", image: UNSPLASH("1568772585407-9361f9bf3a87", 1600), ctaLabel: "Shop Bikes", link: "/category/bikes", position: "HERO", sortOrder: 0 },
      { title: "Machines & Legends", subtitle: "Supercars, JDM icons and Formula 1, framed.", image: UNSPLASH("1503376780353-7e6692767b70", 1600), ctaLabel: "Shop Cars", link: "/category/cars", position: "HERO", sortOrder: 1 },
      { title: "Anime, Reimagined", subtitle: "Bold character art & minimal scenes for your wall.", image: UNSPLASH("1578632767115-351597cf2477", 1600), ctaLabel: "Shop Anime", link: "/category/anime", position: "HERO", sortOrder: 2 },
      { title: "Free framing above ₹2,499", subtitle: "This week only.", image: UNSPLASH("1524169358666-79f22534bc6e", 1200), ctaLabel: "Shop the sale", link: "/sale", position: "OFFER", sortOrder: 0 },
    ],
  });
  console.log("   ✔ banners");

  // Coupons
  await prisma.coupon.createMany({
    data: [
      { code: "PULSE10", description: "10% off your first order", type: "PERCENTAGE", value: 10, minPurchase: 999, maxDiscount: 500, usageLimit: 1000, perUserLimit: 1, isActive: true },
      { code: "FLAT200", description: "₹200 off above ₹1499", type: "FLAT", value: 200, minPurchase: 1499, usageLimit: 500, isActive: true },
      { code: "FREESHIP", description: "Free shipping, no minimum", type: "FREE_SHIPPING", value: 0, isActive: true },
    ],
  });
  console.log("   ✔ coupons");

  // FAQs
  await prisma.faq.createMany({
    data: [
      { question: "What paper do you print on?", answer: "All prints use 200–260gsm archival, acid-free stock with pigment inks rated for 100+ years of fade resistance.", category: "Products", position: 0 },
      { question: "How long does delivery take?", answer: "Unframed prints ship in 2–4 business days; framed pieces in 4–7 days. You'll get tracking at every step.", category: "Shipping", position: 1 },
      { question: "What is your return policy?", answer: "7-day easy returns on unframed prints in original condition. Framed and limited editions are made-to-order and non-returnable unless damaged.", category: "Returns", position: 2 },
      { question: "Do you offer custom sizes?", answer: "Yes — contact our studio for bespoke sizing and gallery commissions.", category: "Products", position: 3 },
    ],
  });
  console.log("   ✔ faqs");

  // Blog
  await prisma.blog.createMany({
    data: [
      { title: "How to build a gallery wall that actually works", slug: "gallery-wall-guide", excerpt: "A studio guide to spacing, framing and hanging like a curator.", content: "Start with an anchor piece…", coverImage: UNSPLASH("1513519245088-0e12902e5a38", 1200), tags: ["guides", "framing"], category: "Guides", isPublished: true, publishedAt: new Date() },
      { title: "Styling a bike & car poster wall for your garage", slug: "garage-poster-styling", excerpt: "Turn a plain garage or man-cave into a motorsport shrine.", content: "Pick a hero machine, build around it…", coverImage: UNSPLASH("1568772585407-9361f9bf3a87", 1200), tags: ["guides", "bikes", "cars"], category: "Guides", isPublished: true, publishedAt: new Date() },
    ],
  });
  console.log("   ✔ blog posts");

  // Shipping zones
  await prisma.shippingZone.createMany({
    data: [
      { name: "Metro", pincodePrefix: "56", fee: 49, freeAbove: 999, etaDaysMin: 2, etaDaysMax: 4 },
      { name: "Metro", pincodePrefix: "40", fee: 49, freeAbove: 999, etaDaysMin: 2, etaDaysMax: 4 },
      { name: "Metro", pincodePrefix: "11", fee: 49, freeAbove: 999, etaDaysMin: 2, etaDaysMax: 4 },
      { name: "Rest of India", pincodePrefix: null, fee: 79, freeAbove: 1499, etaDaysMin: 4, etaDaysMax: 8 },
    ],
  });
  console.log("   ✔ shipping zones");

  // Settings
  await prisma.setting.createMany({
    data: [
      { key: "store", value: { currency: "INR", codEnabled: true, giftWrapFee: 49 } },
      { key: "announcement", value: { text: "Free shipping over ₹999 · 7-day returns · Made in India 🇮🇳", enabled: true } },
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
