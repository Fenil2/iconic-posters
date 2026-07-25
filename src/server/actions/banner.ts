"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

const schema = z.object({
  title: z.string().min(2).max(100),
  subtitle: z.string().optional().or(z.literal("")),
  image: z.string().url("Enter a valid image URL"),
  link: z.string().optional().or(z.literal("")),
  ctaLabel: z.string().optional().or(z.literal("")),
  position: z.enum(["HERO", "OFFER", "CATEGORY", "PROMO_STRIP"]).default("HERO"),
});

export interface BannerResult {
  ok: boolean;
  error?: string;
}

export async function createBanner(input: unknown): Promise<BannerResult> {
  await requireAdmin();
  const parsed = schema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid" };
  const d = parsed.data;
  const count = await prisma.banner.count({ where: { position: d.position } });
  await prisma.banner.create({
    data: {
      title: d.title,
      subtitle: d.subtitle || null,
      image: d.image,
      link: d.link || null,
      ctaLabel: d.ctaLabel || null,
      position: d.position,
      sortOrder: count,
    },
  });
  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { ok: true };
}

export async function toggleBanner(id: string, isActive: boolean): Promise<BannerResult> {
  await requireAdmin();
  await prisma.banner.update({ where: { id }, data: { isActive } });
  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteBanner(id: string): Promise<BannerResult> {
  await requireAdmin();
  await prisma.banner.delete({ where: { id } });
  revalidatePath("/admin/banners");
  revalidatePath("/");
  return { ok: true };
}
