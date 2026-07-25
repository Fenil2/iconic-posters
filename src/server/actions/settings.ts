"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export interface SettingsResult {
  ok: boolean;
  error?: string;
}

/** Upsert a settings key (arbitrary JSON value). */
export async function saveSetting(key: string, value: unknown): Promise<SettingsResult> {
  await requireAdmin();
  await prisma.setting.upsert({
    where: { key },
    update: { value: value as object },
    create: { key, value: value as object },
  });
  revalidatePath("/");
  revalidatePath("/admin/settings");
  return { ok: true };
}
