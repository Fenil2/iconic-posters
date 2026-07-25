import type { Metadata } from "next";
import { Bell } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { safe } from "@/server/queries/content";
import { timeAgo } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Notifications", robots: { index: false } };

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  const notifications = await safe(
    () =>
      prisma.notification.findMany({
        where: { userId: user!.id },
        orderBy: { createdAt: "desc" },
        take: 30,
      }),
    [],
  );

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-3xl font-semibold tracking-tight">Notifications</h1>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-20 text-center">
          <Bell className="size-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">You’re all caught up.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`rounded-xl border p-4 ${n.isRead ? "border-border" : "border-primary bg-secondary/30"}`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">{n.title}</p>
                <span className="text-xs text-muted-foreground">{timeAgo(n.createdAt)}</span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{n.body}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
