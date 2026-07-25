import Link from "next/link";
import { Logo } from "@/components/layout/logo";

/** Split-screen editorial auth layout: form on the left, gallery on the right. */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <div className="flex flex-col px-6 py-8 sm:px-12">
        <header className="flex items-center justify-between">
          <Logo />
          <Link
            href="/"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to store
          </Link>
        </header>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-sm">{children}</div>
        </div>
      </div>

      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1200&q=80)",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/20" />
        <div className="absolute bottom-0 p-12 text-white">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-white/60">
            Iconik Editions
          </p>
          <h2 className="mt-3 max-w-sm font-serif text-3xl font-semibold leading-tight">
            Your walls deserve more than empty space.
          </h2>
        </div>
      </div>
    </div>
  );
}
