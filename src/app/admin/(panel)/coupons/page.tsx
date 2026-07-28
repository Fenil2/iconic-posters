import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { safe } from "@/server/queries/content";
import { CouponManager, type CouponRow } from "@/components/admin/coupon-manager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Coupons · Admin", robots: { index: false } };

export default async function AdminCouponsPage() {
  const rows = await safe(
    () => prisma.coupon.findMany({ orderBy: { createdAt: "desc" } }),
    [],
  );
  const coupons: CouponRow[] = rows.map((c) => ({
    id: c.id,
    code: c.code,
    description: c.description,
    type: c.type,
    value: Number(c.value),
    minPurchase: Number(c.minPurchase),
    usageLimit: c.usageLimit,
    usageCount: c.usageCount,
    isActive: c.isActive,
    expiresAt: c.expiresAt?.toISOString() ?? null,
  }));

  return <CouponManager coupons={coupons} />;
}
