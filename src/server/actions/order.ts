"use server";

import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth";
import { createOrderSchema, type CreateOrderInput } from "@/lib/validations/checkout";
import { validateCoupon } from "@/server/queries/coupon";
import { computeTotals } from "@/lib/pricing";
import { getRazorpay, isRazorpayConfigured, verifyPaymentSignature } from "@/lib/razorpay";
import { generateOrderNumber } from "@/lib/utils";
import { siteConfig } from "@/config/site";

export interface CreateOrderResult {
  ok: boolean;
  error?: string;
  orderNumber?: string;
  payment?:
    | { method: "COD" }
    | {
        method: "RAZORPAY";
        razorpayOrderId: string;
        amount: number;
        currency: string;
        keyId: string;
      };
}

const COD_FEE = siteConfig.shipping.codFee;

/**
 * Create an order with authoritative, server-recomputed pricing.
 * Never trusts client prices — looks up each variant fresh and re-validates
 * stock and coupons. Returns a Razorpay order for online payment, or confirms
 * immediately for COD.
 */
export async function createOrder(
  input: CreateOrderInput,
): Promise<CreateOrderResult> {
  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid order" };
  }
  const data = parsed.data;

  let user;
  try {
    user = await requireUser();
  } catch {
    return { ok: false, error: "Please sign in to place an order" };
  }

  if (data.paymentMethod === "RAZORPAY" && !isRazorpayConfigured()) {
    return {
      ok: false,
      error: "Online payment isn't configured yet. Please choose Cash on Delivery.",
    };
  }

  // Resolve authoritative line items.
  const productIds = [...new Set(data.items.map((i) => i.productId))];
  const products = await prisma.product.findMany({
    where: { id: { in: productIds }, status: "ACTIVE" },
    include: {
      images: { orderBy: { position: "asc" }, take: 1 },
      variants: true,
    },
  });
  const productMap = new Map(products.map((p) => [p.id, p]));

  const lines: {
    productId: string;
    variantId: string | null;
    name: string;
    image: string | null;
    size: string | null;
    paperType: string | null;
    frameType: string | null;
    sku: string | null;
    unitPrice: number;
    quantity: number;
    total: number;
    stockVariantId: string | null;
    stockAvailable: number;
  }[] = [];

  for (const item of data.items) {
    const product = productMap.get(item.productId);
    if (!product) return { ok: false, error: "A product in your bag is no longer available" };

    const variant =
      product.variants.find((v) => v.id === item.variantId) ??
      product.variants.find((v) => v.isDefault) ??
      product.variants[0];

    const unitPrice = variant ? Number(variant.price) : Number(product.basePrice);
    const available = variant ? variant.stock : 999;
    if (available < item.quantity) {
      return { ok: false, error: `"${product.name}" is out of stock` };
    }

    lines.push({
      productId: product.id,
      variantId: variant?.id ?? null,
      name: product.name,
      image: product.images[0]?.url ?? null,
      size: variant?.size ?? null,
      paperType: variant?.paperType ?? null,
      frameType: variant?.frameType ?? null,
      sku: variant?.sku ?? product.sku,
      unitPrice,
      quantity: item.quantity,
      total: unitPrice * item.quantity,
      stockVariantId: variant?.id ?? null,
      stockAvailable: available,
    });
  }

  const subtotal = lines.reduce((sum, l) => sum + l.total, 0);

  // Coupon (server-validated).
  let couponId: string | null = null;
  let appliedCoupon = null;
  if (data.couponCode) {
    const res = await validateCoupon(data.couponCode, subtotal, user.id);
    if (!res.ok) return { ok: false, error: res.error };
    appliedCoupon = res.coupon ?? null;
    const dbCoupon = await prisma.coupon.findUnique({
      where: { code: data.couponCode.trim().toUpperCase() },
    });
    couponId = dbCoupon?.id ?? null;
  }

  const codFee = data.paymentMethod === "COD" ? COD_FEE : 0;
  const totals = computeTotals({
    subtotal,
    coupon: appliedCoupon,
    giftWrap: data.giftWrap,
    taxRate: 0, // storefront prices are tax-inclusive
    codFee,
  });

  const orderNumber = generateOrderNumber();
  const isCod = data.paymentMethod === "COD";

  // Persist order (+ items, payment, timeline) transactionally.
  const order = await prisma.$transaction(async (tx) => {
    const created = await tx.order.create({
      data: {
        orderNumber,
        userId: user.id,
        status: isCod ? "CONFIRMED" : "PENDING",
        paymentStatus: "PENDING",
        paymentMethod: data.paymentMethod,
        subtotal: totals.subtotal,
        discount: totals.discount,
        shippingFee: totals.shipping,
        tax: totals.tax,
        giftWrapFee: totals.giftWrap,
        total: totals.total,
        couponCode: data.couponCode ?? null,
        couponId,
        giftWrap: data.giftWrap,
        orderNotes: data.orderNotes || null,
        deliverySlot: data.deliverySlot ?? null,
        shippingSnapshot: data.address,
        estimatedDelivery: new Date(Date.now() + 6 * 86400000),
        items: {
          create: lines.map((l) => ({
            productId: l.productId,
            variantId: l.variantId,
            name: l.name,
            image: l.image,
            size: l.size,
            paperType: l.paperType,
            frameType: l.frameType,
            sku: l.sku,
            unitPrice: l.unitPrice,
            quantity: l.quantity,
            total: l.total,
          })),
        },
        timeline: {
          create: {
            status: isCod ? "CONFIRMED" : "PENDING",
            note: isCod ? "Order placed (Cash on Delivery)" : "Awaiting payment",
          },
        },
        payment: {
          create: {
            provider: isCod ? "COD" : "RAZORPAY",
            status: "PENDING",
            amount: totals.total,
            currency: "INR",
          },
        },
      },
    });

    // COD reserves stock immediately.
    if (isCod) {
      await reserveStockAndCoupon(tx, lines, couponId, user.id, created.id);
    }
    return created;
  });

  if (isCod) {
    return { ok: true, orderNumber, payment: { method: "COD" } };
  }

  // Online: create a Razorpay order and store its id.
  const razorpay = getRazorpay();
  if (!razorpay) {
    return { ok: false, error: "Payment gateway unavailable" };
  }
  const rzpOrder = await razorpay.orders.create({
    amount: totals.total * 100, // paise
    currency: "INR",
    receipt: orderNumber,
    notes: { orderNumber, userId: user.id },
  });
  await prisma.payment.update({
    where: { orderId: order.id },
    data: { providerOrderId: rzpOrder.id },
  });

  return {
    ok: true,
    orderNumber,
    payment: {
      method: "RAZORPAY",
      razorpayOrderId: rzpOrder.id,
      amount: totals.total,
      currency: "INR",
      keyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
    },
  };
}

/** Verify a Razorpay payment and confirm the order (stock + coupon + status). */
export async function confirmRazorpayPayment(input: {
  orderNumber: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<{ ok: boolean; error?: string }> {
  const valid = verifyPaymentSignature({
    orderId: input.razorpayOrderId,
    paymentId: input.razorpayPaymentId,
    signature: input.razorpaySignature,
  });
  if (!valid) return { ok: false, error: "Payment verification failed" };

  const order = await prisma.order.findUnique({
    where: { orderNumber: input.orderNumber },
    include: { items: true, payment: true },
  });
  if (!order) return { ok: false, error: "Order not found" };
  if (order.paymentStatus === "PAID") return { ok: true };

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { orderId: order.id },
      data: {
        status: "PAID",
        providerPaymentId: input.razorpayPaymentId,
        providerSignature: input.razorpaySignature,
      },
    });
    await tx.order.update({
      where: { id: order.id },
      data: { status: "CONFIRMED", paymentStatus: "PAID" },
    });
    await tx.orderTimeline.create({
      data: { orderId: order.id, status: "CONFIRMED", note: "Payment received" },
    });
    const lines = order.items.map((i) => ({
      productId: i.productId!,
      stockVariantId: i.variantId,
      quantity: i.quantity,
    }));
    await reserveStockAndCoupon(tx, lines, order.couponId, order.userId, order.id);
  });

  return { ok: true };
}

/**
 * Idempotently mark an order paid from a verified Razorpay webhook event.
 * Safe to call multiple times — no-ops once the order is already PAID.
 */
export async function markOrderPaidByProviderOrder(
  providerOrderId: string,
  paymentId: string,
): Promise<void> {
  const payment = await prisma.payment.findFirst({
    where: { providerOrderId },
    include: { order: { include: { items: true } } },
  });
  if (!payment || !payment.order) return;
  if (payment.status === "PAID") return;

  const order = payment.order;
  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { orderId: order.id },
      data: { status: "PAID", providerPaymentId: paymentId },
    });
    await tx.order.update({
      where: { id: order.id },
      data: { status: "CONFIRMED", paymentStatus: "PAID" },
    });
    await tx.orderTimeline.create({
      data: { orderId: order.id, status: "CONFIRMED", note: "Payment confirmed (webhook)" },
    });
    const lines = order.items.map((i) => ({
      productId: i.productId!,
      stockVariantId: i.variantId,
      quantity: i.quantity,
    }));
    await reserveStockAndCoupon(tx, lines, order.couponId, order.userId, order.id);
  });
}

/** Decrement variant stock, bump soldCount, record coupon redemption. */
async function reserveStockAndCoupon(
  tx: Parameters<Parameters<typeof prisma.$transaction>[0]>[0],
  lines: { productId: string; stockVariantId: string | null; quantity: number }[],
  couponId: string | null,
  userId: string,
  orderId: string,
) {
  for (const l of lines) {
    if (l.stockVariantId) {
      await tx.productVariant.update({
        where: { id: l.stockVariantId },
        data: { stock: { decrement: l.quantity } },
      });
    }
    await tx.product.update({
      where: { id: l.productId },
      data: { soldCount: { increment: l.quantity } },
    });
  }
  if (couponId) {
    await tx.coupon.update({
      where: { id: couponId },
      data: { usageCount: { increment: 1 } },
    });
    await tx.couponRedemption.create({
      data: { couponId, userId, orderId },
    });
  }
}
