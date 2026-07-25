import type { Metadata } from "next";
import { Users } from "lucide-react";
import { getAdminCustomers } from "@/server/queries/admin";
import { safe } from "@/server/queries/content";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Customers · Admin", robots: { index: false } };

export default async function AdminCustomersPage() {
  const customers = await safe(getAdminCustomers, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-semibold tracking-tight">Customers</h1>
        <p className="mt-1 text-sm text-muted-foreground">{customers.length} registered customers</p>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-secondary/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="p-4 font-medium">Customer</th>
                <th className="p-4 font-medium">Email</th>
                <th className="p-4 font-medium">Orders</th>
                <th className="p-4 font-medium">Joined</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {customers.length === 0 && (
                <tr><td colSpan={5} className="p-12 text-center">
                  <Users className="mx-auto size-8 text-muted-foreground" />
                  <p className="mt-2 text-sm text-muted-foreground">No customers yet.</p>
                </td></tr>
              )}
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-secondary/30">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="size-9">
                        <AvatarImage src={c.image ?? undefined} />
                        <AvatarFallback>{c.name?.[0] ?? "U"}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{c.name ?? "—"}</span>
                    </div>
                  </td>
                  <td className="p-4 text-muted-foreground">{c.email}</td>
                  <td className="p-4">{c._count.orders}</td>
                  <td className="p-4 text-muted-foreground">{formatDate(c.createdAt)}</td>
                  <td className="p-4">
                    <Badge variant={c.isActive ? "success" : "muted"}>
                      {c.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
