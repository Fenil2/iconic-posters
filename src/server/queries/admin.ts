import "server-only";
import { prisma } from "@/lib/prisma";

/** Dashboard KPIs + revenue trend + top products for the admin home. */
export async function getAdminDashboard() {
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const last30 = new Date(Date.now() - 30 * 86400000);

  const [
    revenueAgg,
    monthRevenueAgg,
    orderCount,
    monthOrders,
    customerCount,
    productCount,
    pendingCount,
    lowStock,
    recentOrders,
    paidOrders,
  ] = await Promise.all([
    prisma.order.aggregate({ _sum: { total: true }, where: { paymentStatus: "PAID" } }),
    prisma.order.aggregate({
      _sum: { total: true },
      where: { paymentStatus: "PAID", createdAt: { gte: monthStart } },
    }),
    prisma.order.count(),
    prisma.order.count({ where: { createdAt: { gte: monthStart } } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.count(),
    prisma.order.count({ where: { status: { in: ["PENDING", "CONFIRMED"] } } }),
    prisma.productVariant.count({ where: { stock: { lte: 5 } } }),
    prisma.order.findMany({
      include: { user: { select: { name: true, email: true } }, items: { take: 1 } },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.order.findMany({
      where: { paymentStatus: "PAID", createdAt: { gte: last30 } },
      select: { total: true, createdAt: true },
    }),
  ]);

  // Daily revenue for the last 14 days.
  const days: { date: string; revenue: number }[] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth(), now.getDate() - i);
    const key = d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
    const revenue = paidOrders
      .filter(
        (o) =>
          o.createdAt.toDateString() === d.toDateString(),
      )
      .reduce((sum, o) => sum + Number(o.total), 0);
    days.push({ date: key, revenue });
  }

  const revenue = Number(revenueAgg._sum.total ?? 0);
  const orders = orderCount || 1;

  const topProducts = await prisma.product.findMany({
    orderBy: { soldCount: "desc" },
    take: 5,
    include: { images: { take: 1, orderBy: { position: "asc" } } },
  });

  return {
    revenue,
    monthRevenue: Number(monthRevenueAgg._sum.total ?? 0),
    orderCount,
    monthOrders,
    customerCount,
    productCount,
    pendingCount,
    lowStock,
    aov: Math.round(revenue / orders),
    trend: days,
    recentOrders,
    topProducts: topProducts.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      soldCount: p.soldCount,
      image: p.images[0]?.url ?? null,
      price: Number(p.basePrice),
    })),
  };
}

export interface AdminProductRow {
  id: string;
  name: string;
  slug: string;
  sku: string;
  status: string;
  price: number;
  image: string | null;
  category: string | null;
  stock: number;
  soldCount: number;
}

export async function getAdminProducts(params: {
  q?: string;
  page?: number;
  pageSize?: number;
}): Promise<{ products: AdminProductRow[]; total: number; pageCount: number }> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = params.pageSize ?? 20;
  const where = params.q
    ? {
        OR: [
          { name: { contains: params.q, mode: "insensitive" as const } },
          { sku: { contains: params.q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [total, rows] = await Promise.all([
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: {
        images: { take: 1, orderBy: { position: "asc" } },
        variants: { select: { stock: true } },
        categories: { include: { category: true }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    total,
    pageCount: Math.max(1, Math.ceil(total / pageSize)),
    products: rows.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      status: p.status,
      price: Number(p.basePrice),
      image: p.images[0]?.url ?? null,
      category: p.categories[0]?.category.name ?? null,
      stock: p.variants.reduce((s, v) => s + v.stock, 0),
      soldCount: p.soldCount,
    })),
  };
}

export async function getAdminOrders(params: { status?: string; page?: number }) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = 20;
  const where = params.status && params.status !== "ALL"
    ? { status: params.status as never }
    : {};
  const [total, orders] = await Promise.all([
    prisma.order.count({ where }),
    prisma.order.findMany({
      where,
      include: { user: { select: { name: true, email: true } }, items: { take: 1 } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);
  return { orders, total, pageCount: Math.max(1, Math.ceil(total / pageSize)) };
}

export async function getCategoriesForSelect() {
  return prisma.category.findMany({
    where: { isActive: true },
    select: { id: true, name: true },
    orderBy: { position: "asc" },
  });
}

/** Full product mapped to the admin form's input shape (for editing). */
export async function getAdminProductForEdit(id: string) {
  const p = await prisma.product.findUnique({
    where: { id },
    include: {
      images: { orderBy: { position: "asc" } },
      variants: { orderBy: { price: "asc" } },
      categories: { take: 1 },
    },
  });
  if (!p) return null;
  return {
    id: p.id,
    initial: {
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      description: p.description,
      shortDescription: p.shortDescription ?? "",
      basePrice: Number(p.basePrice),
      mrp: Number(p.mrp),
      taxRate: Number(p.taxRate),
      orientation: p.orientation,
      status: p.status,
      categoryId: p.categories[0]?.categoryId ?? "",
      theme: p.theme ?? "",
      color: p.color ?? "",
      artist: p.artist ?? "",
      brand: p.brand ?? "PULSE",
      isFeatured: p.isFeatured,
      isBestSeller: p.isBestSeller,
      isNewArrival: p.isNewArrival,
      isTrending: p.isTrending,
      isLimitedEdition: p.isLimitedEdition,
      metaTitle: p.metaTitle ?? "",
      metaDescription: p.metaDescription ?? "",
      images: p.images.map((img) => ({ url: img.url, alt: img.alt ?? "" })),
      variants: p.variants.map((v) => ({
        id: v.id,
        size: v.size,
        paperType: v.paperType,
        frameType: v.frameType,
        price: Number(v.price),
        mrp: Number(v.mrp),
        stock: v.stock,
        sku: v.sku,
      })),
    },
  };
}

export async function getAdminOrderDetail(orderNumber: string) {
  return prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      payment: true,
      timeline: { orderBy: { createdAt: "desc" } },
      user: { select: { name: true, email: true, phone: true } },
    },
  });
}

export async function getAdminCustomers() {
  return prisma.user.findMany({
    where: { role: "CUSTOMER" },
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: "desc" },
    take: 100,
  });
}
