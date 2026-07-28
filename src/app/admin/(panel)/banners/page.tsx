import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { safe } from "@/server/queries/content";
import { BannerManager, type BannerRow } from "@/components/admin/banner-manager";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Banners · Admin", robots: { index: false } };

export default async function AdminBannersPage() {
  const rows = await safe(
    () => prisma.banner.findMany({ orderBy: [{ position: "asc" }, { sortOrder: "asc" }] }),
    [],
  );
  const banners: BannerRow[] = rows.map((b) => ({
    id: b.id,
    title: b.title,
    subtitle: b.subtitle,
    image: b.image,
    position: b.position,
    isActive: b.isActive,
  }));

  return <BannerManager banners={banners} />;
}
