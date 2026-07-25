import NextAuth from "next-auth";
import { NextResponse } from "next/server";
import { authConfig } from "@/lib/auth/auth.config";

// Edge-safe middleware: uses only the base config (no Prisma / bcrypt).
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth?.user;
  const role = req.auth?.user?.role;
  const { pathname } = nextUrl;

  const isAdminRoute = pathname.startsWith("/admin");
  const isProtected =
    pathname.startsWith("/account") || pathname.startsWith("/checkout");
  const isAuthPage =
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/forgot-password";

  // Signed-in users shouldn't see auth pages.
  if (isAuthPage && isLoggedIn) {
    return NextResponse.redirect(new URL("/account", nextUrl));
  }

  // Admin gate.
  if (isAdminRoute) {
    const allowed =
      isLoggedIn &&
      (role === "ADMIN" || role === "SUPER_ADMIN" || role === "STAFF");
    if (!allowed) {
      const url = new URL("/login", nextUrl);
      url.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(url);
    }
  }

  // Customer-protected routes.
  if (isProtected && !isLoggedIn) {
    const url = new URL("/login", nextUrl);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|svg|webp|ico)$).*)"],
};
