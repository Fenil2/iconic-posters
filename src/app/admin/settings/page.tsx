import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { safe } from "@/server/queries/content";
import { SettingsForm } from "@/components/admin/settings-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Settings · Admin", robots: { index: false } };

export default async function AdminSettingsPage() {
  const settings = await safe(() => prisma.setting.findMany(), []);
  const map = new Map(settings.map((s) => [s.key, s.value as Record<string, unknown>]));

  const announcement = (map.get("announcement") ?? {}) as { text?: string; enabled?: boolean };
  const store = (map.get("store") ?? {}) as { codEnabled?: boolean; giftWrapFee?: number };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">Store-wide configuration.</p>
      </div>
      <SettingsForm
        announcement={{
          text: announcement.text ?? "Free shipping over ₹999 · 7-day returns · Made in India 🇮🇳",
          enabled: announcement.enabled ?? true,
        }}
        store={{
          codEnabled: store.codEnabled ?? true,
          giftWrapFee: store.giftWrapFee ?? 49,
        }}
      />
    </div>
  );
}
