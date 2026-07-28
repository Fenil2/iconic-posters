import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminUserMenu } from "@/components/admin/admin-user-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const allowed =
    user && ["ADMIN", "SUPER_ADMIN", "STAFF"].includes(user.role ?? "");
  if (!allowed) redirect("/admin/login?callbackUrl=/admin");

  return (
    <div className="flex min-h-dvh bg-secondary/20">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur">
          <p className="text-sm text-muted-foreground">
            Welcome back, <span className="font-medium text-foreground">{user!.name}</span>
          </p>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <AdminUserMenu
              name={user!.name}
              email={user!.email}
              image={user!.image}
              role={user!.role}
            />
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden p-6">{children}</main>
      </div>
    </div>
  );
}
