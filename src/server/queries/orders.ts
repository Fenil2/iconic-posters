import "server-only";
import { prisma } from "@/lib/prisma";

/** Fetch a single order (scoped to owner unless allowAny for admins). */
export async function getOrderByNumber(
  orderNumber: string,
  userId: string,
  allowAny = false,
) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: {
      items: true,
      payment: true,
      timeline: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!order) return null;
  if (!allowAny && order.userId !== userId) return null;
  return order;
}

/** List a customer's orders (most recent first). */
export async function getUserOrders(userId: string) {
  return prisma.order.findMany({
    where: { userId },
    include: {
      items: { take: 4 },
      payment: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getUserOrderCount(userId: string) {
  return prisma.order.count({ where: { userId } });
}
