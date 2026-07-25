"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const FLOW = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "RETURNED", "REFUNDED"] as const;
type Status = (typeof FLOW)[number];

export interface AdminOrderResult {
  ok: boolean;
  error?: string;
}

/** Update an order's fulfilment status and append a timeline entry. */
export async function updateOrderStatus(
  orderNumber: string,
  status: Status,
  note?: string,
  tracking?: { courier?: string; trackingNumber?: string },
): Promise<AdminOrderResult> {
  await requireAdmin();
  const order = await prisma.order.findUnique({ where: { orderNumber } });
  if (!order) return { ok: false, error: "Order not found" };

  await prisma.$transaction([
    prisma.order.update({
      where: { orderNumber },
      data: {
        status,
        ...(status === "DELIVERED" && order.paymentMethod === "COD"
          ? { paymentStatus: "PAID" }
          : {}),
        ...(status === "REFUNDED" ? { paymentStatus: "REFUNDED" } : {}),
        ...(tracking?.courier ? { courier: tracking.courier } : {}),
        ...(tracking?.trackingNumber ? { trackingNumber: tracking.trackingNumber } : {}),
      },
    }),
    prisma.orderTimeline.create({
      data: { orderId: order.id, status, note: note || `Status updated to ${status}` },
    }),
  ]);

  revalidatePath(`/admin/orders/${orderNumber}`);
  revalidatePath("/admin/orders");
  return { ok: true };
}
