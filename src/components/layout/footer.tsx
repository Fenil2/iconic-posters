import Link from "next/link";
import { Instagram, Facebook, Youtube } from "@/components/icons";
import { Logo } from "./logo";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { siteConfig } from "@/config/site";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/shop" },
      { label: "Collections", href: "/collections" },
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "FAQs", href: "/faq" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Shipping Policy", href: "/shipping" },
      { label: "Return & Refund Policy", href: "/returns" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Track Order", href: "/track-order" },
      { label: "My Account", href: "/account" },
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "Best Sellers", href: "/best-sellers" },
    ],
  },
];

const socials = [
  { label: "Instagram", icon: Instagram, href: siteConfig.social.instagram },
  { label: "Facebook", icon: Facebook, href: siteConfig.social.facebook },
  { label: "YouTube", icon: Youtube, href: siteConfig.social.youtube },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-black text-white">
      <div className="mx-auto max-w-[1400px] px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-5">
            <Logo variant="stacked" onDark className="h-24" />
            <p className="max-w-xs text-sm text-white/60">
              Premium posters designed to make every wall iconic.
            </p>
            <div>
              <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">
                Follow Us
              </h4>
              <div className="flex gap-2">
                {socials.map(({ label, icon: Icon, href }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    title={label}
                    className="grid size-10 place-items-center rounded-sm border border-white/20 transition-colors hover:border-accent hover:bg-accent"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-[11px] font-bold uppercase tracking-[0.18em] text-white/50">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-white/75 transition-colors hover:text-accent"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-8 border-t border-white/15 pt-10 lg:grid-cols-[1.4fr_2fr] lg:items-center">
          <div>
            <h4 className="font-display text-2xl font-bold uppercase leading-none">
              Stay Updated
            </h4>
            <p className="mt-2 text-sm text-white/60">
              Never miss new collections, exclusive launches, limited editions
              and exciting offers.
            </p>
          </div>
          <NewsletterForm />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/15 pt-8 text-xs text-white/50 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights
            reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-white">
              Terms
            </Link>
            <Link href="/shipping" className="hover:text-white">
              Shipping
            </Link>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="hover:text-white"
            >
              {siteConfig.contact.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
