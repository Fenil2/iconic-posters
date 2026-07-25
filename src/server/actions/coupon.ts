"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const couponSchema = z.object({
  code: z.string().min(3).max(30).transform((s) => s.trim().toUpperCase()),
  description: z.string().optional().or(z.literal("")),
  type: z.enum(["PERCENTAGE", "FLAT", "FREE_SHIPPING"]),
  value: z.coerce.number().min(0),
  minPurchase: z.coerce.number().min(0).default(0),
  maxDiscount: z.coerce.number().optional(),
  usageLimit: z.coerce.number().int().optional(),
  perUserLimit: z.coerce.number().int().optional(),
  expiresAt: z.string().optional(),
});

export interface CouponResult {
  ok: boolean;
  error?: string;
}

export async function createCoupon(input: unknown): Promise<CouponResult> {
  await requireAdmin();
  const parsed = couponSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const d = parsed.data;

  const exists = await prisma.coupon.findUnique({ where: { code: d.code } });
  if (exists) return { ok: false, error: "Coupon code already exists" };

  await prisma.coupon.create({
    data: {
      code: d.code,
      description: d.description || null,
      type: d.type,
      value: d.value,
      minPurchase: d.minPurchase,
      maxDiscount: d.maxDiscount ?? null,
      usageLimit: d.usageLimit ?? null,
      perUserLimit: d.perUserLimit ?? null,
      expiresAt: d.expiresAt ? new Date(d.expiresAt) : null,
    },
  });
  revalidatePath("/admin/coupons");
  return { ok: true };
}

export async function toggleCoupon(id: string, isActive: boolean): Promise<CouponResult> {
  await requireAdmin();
  await prisma.coupon.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/coupons");
  return { ok: true };
}

export async function deleteCoupon(id: string): Promise<CouponResult> {
  await requireAdmin();
  await prisma.coupon.delete({ where: { id } });
  revalidatePath("/admin/coupons");
  return { ok: true };
}
