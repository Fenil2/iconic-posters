"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut, useSession } from "next-auth/react";
import {
  Heart,
  ShoppingBag,
  User,
  Menu,
  Package,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from "@/components/icons";
import { cn } from "@/lib/utils";
import { Logo } from "./logo";
import { SearchBar } from "./search-bar";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { megaMenu, primaryNav, storeCollections } from "@/config/navigation";
import { useCart } from "@/hooks/use-cart";
import { useWishlist } from "@/hooks/use-wishlist";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/** Announcement ticker copy, one phrase per marquee segment. */
const announcements = [
  "Fast shipping across India",
  "Secure packaging",
  "New designs added regularly",
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { count } = useCart();
  const { count: wishCount } = useWishlist();
  const { data: session } = useSession();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isAdmin =
    session?.user?.role &&
    ["ADMIN", "SUPER_ADMIN", "STAFF"].includes(session.user.role);

  return (
    <>
      {/* Announcement ticker */}
      <div className="overflow-hidden bg-foreground py-2 text-background">
        <div className="flex w-max animate-marquee">
          {[0, 1].map((track) => (
            <div key={track} aria-hidden={track === 1} className="flex shrink-0">
              {Array.from({ length: 4 }).flatMap((_, rep) =>
                announcements.map((a) => (
                  <span
                    key={`${track}-${rep}-${a}`}
                    className="flex items-center whitespace-nowrap px-6 text-[11px] font-semibold uppercase tracking-[0.18em]"
                  >
                    <span className="mr-6 text-accent">✦</span>
                    {a}
                  </span>
                )),
              )}
            </div>
          ))}
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-background transition-shadow",
          scrolled && "shadow-[0_1px_16px_rgba(0,0,0,0.08)]",
        )}
        onMouseLeave={() => setActiveMenu(null)}
      >
        {/* Row 1 — brand, search, actions */}
        <div className="mx-auto flex max-w-[1400px] items-center gap-3 px-4 py-3 lg:gap-8">
          <button
            className="-ml-1 grid size-10 shrink-0 place-items-center lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-6" />
          </button>

          <Logo />

          <div className="ml-auto hidden max-w-xl flex-1 lg:block">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-0.5 lg:ml-0">
            <ThemeToggle />

            <Link
              href="/account/wishlist"
              aria-label="Wishlist"
              className="relative hidden size-10 place-items-center rounded-md transition-colors hover:bg-secondary sm:grid"
            >
              <Heart className="size-5" />
              {wishCount > 0 && (
                <span className="absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="grid size-10 place-items-center rounded-md outline-none transition-colors hover:bg-secondary">
                  <Avatar className="size-8">
                    <AvatarImage src={session.user.image ?? undefined} />
                    <AvatarFallback>
                      {session.user.name?.[0] ?? "U"}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="normal-case">
                    <p className="text-sm font-medium text-foreground">
                      {session.user.name}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {session.user.email}
                    </p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">
                      <LayoutDashboard /> Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/orders">
                      <Package /> Orders
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account/wishlist">
                      <Heart /> Wishlist
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link href="/admin">
                          <LayoutDashboard /> Admin Panel
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                    <LogOut /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                href="/login"
                aria-label="Account"
                className="grid size-10 place-items-center rounded-md transition-colors hover:bg-secondary"
              >
                <User className="size-5" />
              </Link>
            )}

            <button
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
              className="relative grid size-10 place-items-center rounded-md transition-colors hover:bg-secondary"
            >
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Row 2 — primary nav (desktop) */}
        <nav className="hidden border-t lg:block">
          <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-1 px-4">
            {megaMenu.map((cat) => (
              <button
                key={cat.slug}
                onMouseEnter={() => setActiveMenu(cat.slug)}
                className={cn(
                  "flex items-center gap-1 border-b-2 border-transparent px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] transition-colors hover:border-foreground",
                  activeMenu === cat.slug && "border-foreground",
                )}
              >
                {cat.label}
                <ChevronDown className="size-3 opacity-50" />
              </button>
            ))}
            {primaryNav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onMouseEnter={() => setActiveMenu(null)}
                className={cn(
                  "border-b-2 border-transparent px-4 py-3 text-[13px] font-semibold uppercase tracking-[0.1em] transition-colors hover:border-foreground",
                  l.label === "Sale" && "text-accent hover:border-accent",
                )}
              >
                {l.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Mobile search + category strip */}
        <div className="lg:hidden">
          <div className="px-4 pb-2.5">
            <SearchBar />
          </div>
          <div className="no-scrollbar flex gap-2 overflow-x-auto border-t px-4 py-2.5">
            {storeCollections.map((c) => (
              <Link
                key={c.slug}
                href={`/category/${c.slug}`}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider"
              >
                <c.icon aria-hidden className="size-3.5" />
                {c.label}
              </Link>
            ))}
            <Link
              href="/sale"
              className="flex shrink-0 items-center rounded-full bg-accent px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-accent-foreground"
            >
              Sale
            </Link>
          </div>
        </div>

        {/* Mega menu panel */}
        <AnimatePresence>
          {activeMenu && (
            <MegaMenuPanel
              slug={activeMenu}
              onClose={() => setActiveMenu(null)}
            />
          )}
        </AnimatePresence>
      </header>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </>
  );
}

function MegaMenuPanel({
  slug,
  onClose,
}: {
  slug: string;
  onClose: () => void;
}) {
  const cat = megaMenu.find((c) => c.slug === slug);
  if (!cat) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="absolute inset-x-0 top-full hidden border-b border-t bg-background shadow-xl lg:block"
    >
      <div className="mx-auto grid max-w-[1400px] grid-cols-[1fr_1fr_1fr_1.2fr] gap-8 px-4 py-8">
        {cat.columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.16em] text-accent">
              {col.title}
            </h4>
            <ul className="space-y-2.5">
              {col.links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={onClose}
                    className="text-sm text-foreground/80 transition-colors hover:text-foreground hover:underline"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div>
          <Link
            href={`/category/${cat.slug}`}
            onClick={onClose}
            className="text-[13px] font-bold uppercase tracking-[0.1em] underline-offset-4 hover:underline"
          >
            Shop all {cat.label} →
          </Link>
          {cat.featured && (
            <Link
              href={cat.featured.href}
              onClick={onClose}
              className="group mt-4 block overflow-hidden rounded-md"
            >
              <div className="relative grid aspect-[4/3] place-items-center overflow-hidden bg-foreground text-background transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <cat.icon
                  aria-hidden
                  className="size-12 transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <p className="mt-2 text-sm font-medium">{cat.featured.label}</p>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
