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
import { megaMenu, primaryNav } from "@/config/navigation";
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
import { Button } from "@/components/ui/button";

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
      {/* Announcement bar */}
      <div className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-[1400px] items-center justify-center gap-6 px-4 py-2 text-xs">
          <span className="font-medium tracking-wide">
            Fast shipping across India · Secure packaging · New designs added
            regularly
          </span>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-40 border-b bg-background/85 backdrop-blur-lg transition-shadow",
          scrolled && "shadow-sm",
        )}
        onMouseLeave={() => setActiveMenu(null)}
      >
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3 lg:gap-8">
          {/* Mobile menu */}
          <button
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="size-6" />
          </button>

          <Logo />

          {/* Desktop nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {megaMenu.map((cat) => (
              <button
                key={cat.slug}
                onMouseEnter={() => setActiveMenu(cat.slug)}
                className={cn(
                  "flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary",
                  activeMenu === cat.slug && "bg-secondary",
                )}
              >
                {cat.label}
                <ChevronDown className="size-3.5 opacity-60" />
              </button>
            ))}
            {primaryNav.slice(0, 3).map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onMouseEnter={() => setActiveMenu(null)}
                className={cn(
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary",
                  l.label === "Sale" && "text-destructive",
                )}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto hidden max-w-md flex-1 lg:block">
            <SearchBar />
          </div>

          {/* Actions */}
          <div className="ml-auto flex items-center gap-0.5 lg:ml-0">
            <ThemeToggle />

            <Link
              href="/account/wishlist"
              aria-label="Wishlist"
              className="relative hidden size-10 place-items-center rounded-full transition-colors hover:bg-secondary sm:grid"
            >
              <Heart className="size-5" />
              {wishCount > 0 && (
                <span className="absolute right-1 top-1 grid size-4 place-items-center rounded-full bg-accent text-[10px] font-semibold text-accent-foreground">
                  {wishCount}
                </span>
              )}
            </Link>

            {/* Account */}
            {session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="grid size-10 place-items-center rounded-full outline-none transition-colors hover:bg-secondary">
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
                className="grid size-10 place-items-center rounded-full transition-colors hover:bg-secondary"
              >
                <User className="size-5" />
              </Link>
            )}

            <button
              onClick={() => setCartOpen(true)}
              aria-label="Cart"
              className="relative grid size-10 place-items-center rounded-full transition-colors hover:bg-secondary"
            >
              <ShoppingBag className="size-5" />
              {count > 0 && (
                <span className="absolute right-0.5 top-0.5 grid size-4 place-items-center rounded-full bg-primary text-[10px] font-semibold text-primary-foreground">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="px-4 pb-3 lg:hidden">
          <SearchBar />
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
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
            className="text-sm font-medium underline-offset-4 hover:underline"
          >
            Shop all {cat.label} →
          </Link>
          {cat.featured && (
            <Link
              href={cat.featured.href}
              onClick={onClose}
              className="group mt-4 block overflow-hidden rounded-lg"
            >
              <div
                className="aspect-[4/3] bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                style={{ backgroundImage: `url(${cat.featured.image})` }}
              />
              <p className="mt-2 text-sm font-medium">{cat.featured.label}</p>
            </Link>
          )}
        </div>
      </div>
    </motion.div>
  );
}
