import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

/**
 * Edge-safe auth configuration (no Prisma / bcrypt here).
 * Consumed by both middleware (edge) and the full Node config in `auth.ts`.
 */
export const authConfig = {
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  callbacks: {
    /** Persist id + role onto the token. */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        // `role` is attached by the credentials authorize() / adapter user
        token.role = (user as { role?: string }).role ?? "CUSTOMER";
      }
      return token;
    },
    /** Expose id + role on the session for the client & server. */
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "CUSTOMER";
      }
      return session;
    },
    /** Route protection used by middleware. */
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const role = auth?.user?.role;
      const { pathname } = nextUrl;

      const isAdminRoute = pathname.startsWith("/admin");
      const isAccountRoute = pathname.startsWith("/account");
      const isCheckoutRoute = pathname.startsWith("/checkout");

      if (isAdminRoute) {
        return (
          isLoggedIn &&
          (role === "ADMIN" || role === "SUPER_ADMIN" || role === "STAFF")
        );
      }
      if (isAccountRoute || isCheckoutRoute) return isLoggedIn;
      return true;
    },
  },
} satisfies NextAuthConfig;
