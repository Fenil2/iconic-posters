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
    <footer className="mt-24 border-t bg-secondary/30">
      <div className="mx-auto max-w-[1400px] px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              Premium posters designed to make every wall iconic.
            </p>
            <div>
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
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
                    className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:bg-background"
                  >
                    <Icon className="size-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {col.title}
              </h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="text-sm text-foreground/80 transition-colors hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 grid gap-8 border-t pt-10 lg:grid-cols-[1.4fr_2fr] lg:items-center">
          <div>
            <h4 className="font-serif text-xl font-semibold">Stay Updated</h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Never miss new collections, exclusive launches, limited editions
              and exciting offers.
            </p>
          </div>
          <NewsletterForm />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-xs text-muted-foreground sm:flex-row">
          <p>
            © {new Date().getFullYear()} {siteConfig.legalName}. All rights
            reserved.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/privacy" className="hover:text-foreground">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              Terms
            </Link>
            <Link href="/shipping" className="hover:text-foreground">
              Shipping
            </Link>
            <a
              href={`mailto:${siteConfig.contact.email}`}
              className="hover:text-foreground"
            >
              {siteConfig.contact.email}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
