import type { Metadata } from "next";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { safe } from "@/server/queries/content";
import { ProfileForm } from "@/components/account/profile-form";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Settings", robots: { index: false } };

export default async function SettingsPage() {
  const user = await getCurrentUser();
  const dbUser = await safe(
    () => prisma.user.findUnique({ where: { id: user!.id } }),
    null,
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your profile and preferences.
        </p>
      </div>

      <ProfileForm
        initial={{
          name: dbUser?.name ?? user?.name ?? "",
          email: dbUser?.email ?? user?.email ?? "",
          phone: dbUser?.phone ?? "",
        }}
      />
    </div>
  );
}
