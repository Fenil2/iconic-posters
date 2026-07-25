import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AccountSidebar } from "@/components/account/account-sidebar";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/login?callbackUrl=/account");

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-10">
      <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="mb-4 rounded-xl border border-border p-4">
            <p className="text-xs text-muted-foreground">Signed in as</p>
            <p className="truncate font-medium">{user.name ?? "Customer"}</p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          <AccountSidebar />
        </aside>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
