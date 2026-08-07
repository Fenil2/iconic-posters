/**
 * Iconik Posters — car-brand catalogue import.
 *
 * Adds the client-supplied car artwork to the "Cars & Bikes" category, one
 * product per image, with `theme` set to the brand slug so the existing
 * mega-menu links (`/category/cars-bikes?theme=bmw`, …) resolve.
 *
 * Unlike `prisma/seed.ts` this script is purely additive — it never calls
 * deleteMany on the catalogue. Re-running it upserts the same products by
 * slug (images and variants are rebuilt), so it is safe to run repeatedly and
 * safe to re-run after a full seed, which would otherwise wipe these rows.
 *
 * Run with:  pnpm db:seed:cars
 */
import { PrismaClient, Orientation } from "@prisma/client";

/**
 * Bulk import runs on the unpooled connection: PgBouncer caches server-side
 * statement plans, which throws a spurious P2022 ("column does not exist")
 * when the schema has changed more recently than the pooled connection. The
 * generous connect_timeout covers a cold start on a suspended Neon compute —
 * the 5s default is not enough to wake it.
 */
function importUrl(): string {
  const url = process.env.DIRECT_URL || process.env.DATABASE_URL;
  if (!url) throw new Error("DIRECT_URL / DATABASE_URL is not set");
  return url.includes("connect_timeout")
    ? url
    : `${url}${url.includes("?") ? "&" : "?"}connect_timeout=60`;
}

const prisma = new PrismaClient({ datasources: { db: { url: importUrl() } } });

/** Cloudinary cloud hosting the client's artwork. */
const CLOUD_NAME = "bktayuij";

/**
 * Delivery transformation applied to every stored URL.
 *
 * The masters are ~4419×6250 / 5.5 MB JPEGs. Served raw, the Next image
 * optimizer has to pull the whole 5.5 MB per poster before it can emit a
 * thumbnail — measured at 6–8s for a single card, which is why the grids
 * looked blank or half-loaded. `f_auto,q_auto,w_2400` drops that to ~486 KB
 * (11× smaller) while still exceeding what the fullscreen lightbox
 * (`sizes="90vw"`) and the 1.8× hover-zoom in product-gallery.tsx can show.
 *
 * Set to "" to store the untouched original instead.
 */
const DELIVERY_TRANSFORM = "f_auto,q_auto,w_2400";

/**
 * Per-asset Cloudinary version (`vNNNNNNNNNN`). Cloudinary resolves the latest
 * asset without it, but pinning the version makes the URL immutable and
 * permanently cacheable. Harvested from each asset's `Server-Timing: … crt=`
 * response header — re-harvest if the client re-uploads any artwork.
 */
const VERSIONS: Record<string, string> = {
  // bmw
  "1_hrfuo2": "1786019684",
  "2_dsg0l8": "1786019697",
  "3_yd7kjf": "1786019702",
  "4_hx4lmx": "1786019689",
  "5_u9jt2n": "1786105630",
  "6_ntjl5l": "1786105630",
  "7_j85lg6": "1786019671",
  "8_gkekfs": "1786019704",
  "9_v2q57l": "1786019705",
  "10_qdzdt8": "1786019686",
  "11_evo0lu": "1786105630",
  "12_qodfjj": "1786019675",
  "13_k8jczs": "1786019689",
  "14_bdy3mb": "1786105630",
  "14_ryacyh": "1786019690",
  "15_pzd3w8": "1786105630",
  "16_cx2qfq": "1786019707",
  "17_oxl7rc": "1786019692",
  "18_stwpzm": "1786019676",
  "19_l0bcgp": "1786019678",
  "20_qaufdl": "1786019693",
  "21_ya1sc2": "1786019695",
  "22_gtzy5q": "1786105630",
  "23_o3xjyf": "1786105631",
  "24_mi3bzo": "1786105632",
  "25_xdn6hl": "1786105632",
  "26_wxdkwy": "1786105632",
  "27_h0w5ar": "1786105632",
  // bugatti
  "1_uzhcbg": "1786019580",
  "2_formphotoeditor.com_jky2ln": "1786105755",
  "3_kybgoi": "1786019584",
  "4_plpmmp": "1786019591",
  "5_undtkd": "1786019585",
  "6_ipm3d4": "1786019593",
  "7_agzlfk": "1786019586",
  "8_msy6ez": "1786019614",
  "9_ln9li8": "1786019588",
  "10_cdfznv": "1786019590",
  // dodge
  "1_zf3wo1": "1786106003",
  "2_g9ylic": "1786106067",
  "3_bz1taw": "1786106075",
  "4_vk9xae": "1786106093",
  "5_p87b0h": "1786106068",
  "6_d5p6ps": "1786106095",
  "7_zfqsya": "1786106072",
  "8_pjhyyq": "1786106073",
  "9_epr9ed": "1786106070",
  "10_dcezms": "1786106004",
  "11_i3wbjl": "1786106005",
  "12_om7rln": "1786106006",
  // ford
  "1_pj0uke": "1786019461",
  "2_gy4o8v": "1786019411",
  "3_gasqsq": "1786019419",
  "4_ybiwfp": "1786019420",
  "5_ggpmzy": "1786019452",
  "6_xme08a": "1786019455",
  "7_ntrcsr": "1786019462",
  "8_vngmsk": "1786019458",
  "9_yju4np": "1786019463",
  "10_a96xnz": "1786019458",
  "11_uz8lxr": "1786019458",
  "12_yjd3dr": "1786019459",
  "13_nneld7": "1786019460",
  "14_nicdph": "1786019464",
  "15_tuay8e": "1786019465",
  // nissan
  "1_khhwjg": "1786019356",
  "2_bokxwc": "1786019360",
  "3_qkbcz3": "1786019357",
  "4_h1ufgm": "1786019358",
  "5_ieics3": "1786106393",
  "6_yqcoru": "1786106391",
  "7_njy4zs": "1786019359",
  "8_sgb6qj": "1786019357",
  "9_qldjou": "1786019360",
  "10_nqgc0d": "1786019359",
  // porsche
  "1_aqctxn": "1786107172",
  "2_hrtjv3": "1786106492",
  "3_pu5oyx": "1786106481",
  "4_zrhgxf": "1786107174",
  "5_yh6swd": "1786107174",
  "6_j8jb3u": "1786107176",
  "7_hyl3sx": "1786107177",
  "8_dqetkn": "1786107175",
  "9_uovuuo": "1786107178",
  "10_eiwke1": "1786106494",
  "11_awtiol": "1786106482",
  "12_u08r0h": "1786106489",
  "13_rgel2x": "1786106506",
  "14_kcgwiy": "1786106501",
  "15_qrcz2a": "1786106504",
  "16_fxwjzn": "1786106480",
  // toyota
  "1_gmn8xp": "1786019221",
  "2_ykr4o2": "1786019233",
  "3_pgw83f": "1786019225",
  "4_yojapa": "1786019230",
  "5_tt8hkn": "1786019232",
  "6_cpj49q": "1786019238",
  "7_s4bh4z": "1786019214",
  "8_y3lv56": "1786019240",
  "9_jahdyo": "1786019247",
  "10_cgk9vm": "1786019249",
};

const CATEGORY_SLUG = "cars-bikes";
const CATEGORY_NAME = "Cars & Bikes";

const SIZES = ["A4", "A3", "18x24", "24x36"] as const;
const PAPERS = ["Matte", "Glossy", "Canvas"] as const;
const FRAMES = ["None", "Black Wood"] as const;

const PAPER_DELTA: Record<string, number> = { Matte: 0, Glossy: 150, Canvas: 400 };
const SIZE_MULTIPLIER: Record<string, number> = {
  A4: 1,
  A3: 1.4,
  "18x24": 1.8,
  "24x36": 2.4,
};
const FRAME_DELTA: Record<string, number> = { None: 0, "Black Wood": 700 };

/** List price for every car poster (INR). */
const BASE_PRICE = 899;

/**
 * Client-supplied artwork, grouped by car brand. Each entry is a Cloudinary
 * public id under `CLOUD_NAME`; the numeric prefix is the client's own
 * ordering and is used to sort within a brand.
 */
const BRANDS: { key: string; label: string; skuCode: string; publicIds: string[] }[] = [
  {
    key: "bmw",
    label: "BMW",
    skuCode: "BMW",
    publicIds: [
      "1_hrfuo2", "2_dsg0l8", "3_yd7kjf", "4_hx4lmx", "5_u9jt2n",
      "6_ntjl5l", "7_j85lg6", "8_gkekfs", "9_v2q57l", "10_qdzdt8",
      "11_evo0lu", "12_qodfjj", "13_k8jczs", "14_bdy3mb", "14_ryacyh",
      "15_pzd3w8", "16_cx2qfq", "17_oxl7rc", "18_stwpzm", "19_l0bcgp",
      "20_qaufdl", "21_ya1sc2", "22_gtzy5q", "23_o3xjyf", "24_mi3bzo",
      "25_xdn6hl", "26_wxdkwy", "27_h0w5ar",
    ],
  },
  {
    key: "bugatti",
    label: "Bugatti",
    skuCode: "BUG",
    publicIds: [
      "1_uzhcbg", "2_formphotoeditor.com_jky2ln", "3_kybgoi", "4_plpmmp", "5_undtkd",
      "6_ipm3d4", "7_agzlfk", "8_msy6ez", "9_ln9li8", "10_cdfznv",
    ],
  },
  {
    key: "dodge",
    label: "Dodge",
    skuCode: "DDG",
    publicIds: [
      "1_zf3wo1", "2_g9ylic", "3_bz1taw", "4_vk9xae", "5_p87b0h", "6_d5p6ps",
      "7_zfqsya", "8_pjhyyq", "9_epr9ed", "10_dcezms", "11_i3wbjl", "12_om7rln",
    ],
  },
  {
    key: "ford",
    label: "Ford",
    skuCode: "FRD",
    publicIds: [
      "1_pj0uke", "2_gy4o8v", "3_gasqsq", "4_ybiwfp", "5_ggpmzy",
      "6_xme08a", "7_ntrcsr", "8_vngmsk", "9_yju4np", "10_a96xnz",
      "11_uz8lxr", "12_yjd3dr", "13_nneld7", "14_nicdph", "15_tuay8e",
    ],
  },
  {
    key: "nissan",
    label: "Nissan",
    skuCode: "NSN",
    publicIds: [
      "1_khhwjg", "2_bokxwc", "3_qkbcz3", "4_h1ufgm", "5_ieics3",
      "6_yqcoru", "7_njy4zs", "8_sgb6qj", "9_qldjou", "10_nqgc0d",
    ],
  },
  {
    key: "porsche",
    label: "Porsche",
    skuCode: "PRS",
    publicIds: [
      "1_aqctxn", "2_hrtjv3", "3_pu5oyx", "4_zrhgxf", "5_yh6swd", "6_j8jb3u",
      "7_hyl3sx", "8_dqetkn", "9_uovuuo", "10_eiwke1", "11_awtiol", "12_u08r0h",
      "13_rgel2x", "14_kcgwiy", "15_qrcz2a", "16_fxwjzn",
    ],
  },
  {
    key: "toyota",
    label: "Toyota",
    skuCode: "TYT",
    publicIds: [
      "1_gmn8xp", "2_ykr4o2", "3_pgw83f", "4_yojapa", "5_tt8hkn",
      "6_cpj49q", "7_s4bh4z", "8_y3lv56", "9_jahdyo", "10_cgk9vm",
    ],
  },
];

/**
 * Build a delivery URL:
 * `https://res.cloudinary.com/<cloud>/image/upload/<transform>/v<version>/<publicId>.jpg`
 */
function imageUrl(publicId: string): string {
  const version = VERSIONS[publicId];
  if (!version) throw new Error(`No Cloudinary version recorded for "${publicId}"`);
  const segments = ["image", "upload"];
  if (DELIVERY_TRANSFORM) segments.push(DELIVERY_TRANSFORM);
  segments.push(`v${version}`, `${publicId}.jpg`);
  return `https://res.cloudinary.com/${CLOUD_NAME}/${segments.join("/")}`;
}

/**
 * Deterministic pseudo-random from a seed string, so re-running the import
 * doesn't churn rating/sold counts on every pass.
 */
function hashInt(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}
const spread = (seed: string, min: number, max: number) =>
  min + (hashInt(seed) % (max - min + 1));

async function main() {
  console.log(`🚗  Importing car posters (cloud: ${CLOUD_NAME})…`);

  // Category — created only if the store doesn't already have it.
  const category = await prisma.category.upsert({
    where: { slug: CATEGORY_SLUG },
    update: {},
    create: {
      name: CATEGORY_NAME,
      slug: CATEGORY_SLUG,
      icon: "Car",
      isFeatured: true,
      position: 3,
      description:
        "Premium cars & bikes posters — high-quality printing, multiple sizes and framing options.",
    },
  });
  console.log(`   ✔ category ${CATEGORY_SLUG}`);

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

  let created = 0;

  for (const brand of BRANDS) {
    for (const [i, publicId] of brand.publicIds.entries()) {
      const n = String(i + 1).padStart(2, "0");
      const name = `${brand.label} Poster ${n}`;
      const slug = `${brand.key}-poster-${n}`;
      const sku = `IKP-${brand.skuCode}-${n}`;
      const mrp = Math.round(BASE_PRICE * 1.6);

      const data = {
        name,
        sku,
        description: `${name} is part of the Iconik Posters ${brand.label} series. Printed on premium, fade-resistant stock for vibrant colour and sharp detail that lasts, and shipped in protective rigid packaging.`,
        shortDescription: `Premium ${brand.label} wall poster by Iconik Posters.`,
        basePrice: BASE_PRICE,
        mrp,
        taxRate: 12,
        orientation: Orientation.PORTRAIT,
        theme: brand.key,
        artist: brand.label,
        brand: "Iconik Posters",
        ratingAverage: Number((4 + (hashInt(slug) % 10) / 10).toFixed(1)),
        ratingCount: spread(`${slug}:rc`, 20, 420),
        soldCount: spread(`${slug}:sc`, 50, 950),
        viewCount: spread(`${slug}:vc`, 500, 9500),
        metaTitle: `${name} | Iconik Posters`,
        metaDescription: `Buy ${name} — premium ${brand.label} car wall poster. Multiple sizes, framing options and fast shipping across India.`,
      };

      const product = await prisma.product.upsert({
        where: { slug },
        update: data,
        create: { ...data, slug },
      });

      // Rebuild the image + category link so a re-run converges on this state.
      await prisma.productImage.deleteMany({ where: { productId: product.id } });
      await prisma.productImage.create({
        data: {
          productId: product.id,
          url: imageUrl(publicId),
          publicId,
          alt: `${name} — premium ${brand.label} wall poster`,
          position: 0,
          isPrimary: true,
        },
      });
      await prisma.productCategory.upsert({
        where: { productId_categoryId: { productId: product.id, categoryId: category.id } },
        update: {},
        create: { productId: product.id, categoryId: category.id },
      });
      await prisma.productVariant.deleteMany({ where: { productId: product.id } });

      let variantIndex = 0;
      for (const size of SIZES) {
        for (const paper of PAPERS) {
          for (const frame of FRAMES) {
            const price = Math.round(
              BASE_PRICE * SIZE_MULTIPLIER[size] + PAPER_DELTA[paper] + FRAME_DELTA[frame],
            );
            variantRows.push({
              productId: product.id,
              sku: `${sku}-${size}-${paper[0]}${frame === "None" ? "N" : "F"}`.toUpperCase(),
              size,
              paperType: paper,
              frameType: frame,
              price,
              mrp: Math.round(price * 1.6),
              stock: spread(`${sku}:${size}:${paper}:${frame}`, 5, 64),
              isDefault: variantIndex === 0,
              weightGram: frame === "None" ? 200 : 900,
            });
            variantIndex++;
          }
        }
      }
      created++;
    }
    console.log(`   ✔ ${brand.label}: ${brand.publicIds.length} posters`);
  }

  // Batched — a per-row loop against Neon takes minutes.
  await prisma.productVariant.createMany({ data: variantRows });

  console.log(`✅  ${created} car posters, ${variantRows.length} variants.`);
}

main()
  .catch((e) => {
    console.error("❌  Car import failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
