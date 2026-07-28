import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Logo } from "@/components/layout/logo";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { getCurrentUser } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Sign In",
  robots: { index: false, follow: false },
};

/**
 * Dedicated staff entry point. It lives outside the `(panel)` route group so
 * it doesn't inherit the guarded admin layout — otherwise the redirect that
 * protects the panel would loop straight back here.
 */
export default async function AdminLoginPage() {
  const user = await getCurrentUser();
  if (user && ["ADMIN", "SUPER_ADMIN", "STAFF"].includes(user.role ?? "")) {
    redirect("/admin");
  }

  return (
    <div className="grid min-h-dvh bg-black text-white lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel */}
      <div className="relative hidden overflow-hidden border-r border-white/10 lg:flex lg:flex-col lg:justify-between lg:p-14">
        <Logo variant="stacked" onDark className="h-28" />
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-accent">
            Store Operations
          </p>
          <h2 className="mt-4 max-w-md font-display text-4xl font-bold uppercase leading-[1.05]">
            Add products. Track every order.
          </h2>
          <p className="mt-4 max-w-sm text-sm text-white/50">
            Catalogue, inventory, orders, coupons and banners — all managed from
            one place.
          </p>
        </div>
        <p className="text-[11px] uppercase tracking-[0.2em] text-white/30">
          Authorised staff only
        </p>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <div className="lg:hidden">
            <Logo variant="stacked" onDark className="h-20" />
          </div>

          <div className="mt-8 lg:mt-0">
            <span className="inline-flex rounded-sm bg-accent px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-accent-foreground">
              Admin Panel
            </span>
            <h1 className="mt-4 font-display text-3xl font-bold uppercase leading-none">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-white/50">
              Use your staff account. Customer logins won&rsquo;t work here.
            </p>
          </div>

          {/*
            The form reads `callbackUrl` from the query string, so it needs a
            Suspense boundary around the `useSearchParams()` hook.
          */}
          <div className="mt-8 [&_label]:text-white/70 [&_input]:border-white/20 [&_input]:bg-white/5 [&_input]:text-white [&_input::placeholder]:text-white/30">
            <Suspense
              fallback={<div className="h-64 animate-pulse rounded-sm bg-white/5" />}
            >
              <AdminLoginForm />
            </Suspense>
          </div>

          <p className="mt-6 rounded-sm border border-white/10 bg-white/5 px-3 py-2.5 text-center text-xs text-white/50">
            Seeded admin:{" "}
            <span className="font-medium text-white">
              admin@iconikposters.in
            </span>{" "}
            / Admin@12345
          </p>

          <Link
            href="/"
            className="mt-8 inline-block text-xs text-white/40 transition-colors hover:text-white"
          >
            ← Back to store
          </Link>
        </div>
      </div>
    </div>
  );
}
