"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn, signOut, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff, Loader2, ShieldCheck } from "@/components/icons";
import { toast } from "sonner";
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const STAFF_ROLES = ["ADMIN", "SUPER_ADMIN", "STAFF"];

/**
 * Credentials-only sign-in for the admin panel. Google sign-in is deliberately
 * absent — staff accounts are provisioned with a password. A customer who
 * signs in here is immediately signed back out rather than being silently
 * dropped on the storefront.
 */
export function AdminLoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const raw = params.get("callbackUrl") ?? "/admin";
  // Only ever bounce back into the admin panel, never to an arbitrary URL.
  const callbackUrl = raw.startsWith("/admin") && raw !== "/admin/login" ? raw : "/admin";

  const [showPw, setShowPw] = useState(false);
  const [denied, setDenied] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data: LoginInput) => {
    setDenied(false);

    const res = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Invalid email or password");
      return;
    }

    // Credentials were valid — now check this account may actually enter.
    const session = await getSession();
    if (!STAFF_ROLES.includes(session?.user?.role ?? "")) {
      setDenied(true);
      toast.error("This account doesn't have admin access");
      await signOut({ redirect: false });
      return;
    }

    toast.success(`Signed in as ${session?.user?.name ?? data.email}`);
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {denied && (
        <p className="rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-xs text-destructive">
          Those credentials are valid, but this account is a customer account.
          Sign in with a staff account, or use the{" "}
          <a href="/login" className="font-semibold underline">
            customer login
          </a>
          .
        </p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="email">Work email</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="admin@iconikposters.in"
          aria-invalid={!!errors.email}
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPw ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            aria-invalid={!!errors.password}
            {...register("password")}
          />
          <button
            type="button"
            onClick={() => setShowPw((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-label={showPw ? "Hide password" : "Show password"}
          >
            {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button
        type="submit"
        size="lg"
        variant="accent"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <ShieldCheck className="size-4" />
        )}
        Enter admin panel
      </Button>
    </form>
  );
}
