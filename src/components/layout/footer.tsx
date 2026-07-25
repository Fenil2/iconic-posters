import Link from "next/link";
import { AtSign, Send, Share2 } from "lucide-react";
import { Logo } from "./logo";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { siteConfig } from "@/config/site";

const columns: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Shop",
    links: [
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "Best Sellers", href: "/best-sellers" },
      { label: "Limited Edition", href: "/collection/limited-edition" },
      { label: "Sale", href: "/sale" },
      { label: "Gift Cards", href: "/gift-cards" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Track Order", href: "/track-order" },
      { label: "Shipping & Delivery", href: "/shipping" },
      { label: "Returns & Refunds", href: "/returns" },
      { label: "FAQs", href: "/faq" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Our Story", href: "/about" },
      { label: "Journal", href: "/blog" },
      { label: "Artists", href: "/artists" },
      { label: "Sustainability", href: "/sustainability" },
      { label: "Careers", href: "/careers" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t bg-secondary/30">
      <div className="mx-auto max-w-[1400px] px-4 py-16">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm text-muted-foreground">
              {siteConfig.description}
            </p>
            <div className="flex gap-2">
              {[
                { icon: AtSign, href: siteConfig.social.instagram },
                { icon: Send, href: siteConfig.social.twitter },
                { icon: Share2, href: siteConfig.social.youtube },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:bg-background"
                >
                  <Icon className="size-4" />
                </a>
              ))}
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
            <h4 className="font-serif text-xl font-semibold">
              Join the PULSE list
            </h4>
            <p className="mt-1 text-sm text-muted-foreground">
              Early access to drops, artist stories and 10% off your first order.
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
            <span>{siteConfig.contact.email}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
