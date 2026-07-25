import "server-only";
import { prisma } from "@/lib/prisma";

/** Aggregate stats for the customer dashboard home. */
export async function getAccountOverview(userId: string) {
  const [orderCount, addressCount, pending, delivered, recentOrders, user] =
    await Promise.all([
      prisma.order.count({ where: { userId } }),
      prisma.address.count({ where: { userId } }),
      prisma.order.count({
        where: { userId, status: { in: ["PENDING", "CONFIRMED", "PACKED", "SHIPPED"] } },
      }),
      prisma.order.count({ where: { userId, status: "DELIVERED" } }),
      prisma.order.findMany({
        where: { userId },
        include: { items: { take: 3 } },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.user.findUnique({ where: { id: userId } }),
    ]);

  return { orderCount, addressCount, pending, delivered, recentOrders, user };
}

export async function getUserAddresses(userId: string) {
  return prisma.address.findMany({
    where: { userId },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });
}

export async function getWishlistProducts(productIds: string[]) {
  if (!productIds.length) return [];
  return prisma.product.findMany({
    where: { id: { in: productIds }, status: "ACTIVE" },
    include: {
      images: { orderBy: { position: "asc" }, take: 2 },
      variants: { select: { stock: true } },
    },
  });
}
