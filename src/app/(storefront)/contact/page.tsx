import type { Metadata } from "next";
import { Mail, Instagram, Clock } from "@/components/icons";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Have questions or need help choosing the perfect poster? Reach the ${siteConfig.name} team by email or on Instagram.`,
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const items = [
    {
      icon: Mail,
      label: "Email",
      value: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
    },
    {
      icon: Instagram,
      label: "Instagram",
      value: siteConfig.social.instagramHandle,
      href: siteConfig.social.instagram,
    },
    {
      icon: Clock,
      label: "Business Hours",
      value: siteConfig.contact.supportHours,
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-4xl font-semibold tracking-tight">
        We&rsquo;d Love To Hear From You
      </h1>
      <div className="mt-4 space-y-1 text-muted-foreground">
        <p>Have questions?</p>
        <p>Need help choosing the perfect poster?</p>
        <p>Want to collaborate?</p>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">
        Our team is always happy to help.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {items.map(({ icon: Icon, label, value, href }) => {
          const body = (
            <>
              <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary">
                <Icon className="size-5" />
              </span>
              <span>
                <span className="block text-sm font-medium">{label}</span>
                <span className="block text-sm text-muted-foreground">
                  {value}
                </span>
              </span>
            </>
          );
          const className =
            "flex items-start gap-3 rounded-xl border border-border p-5 transition-colors";
          return href ? (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              className={`${className} hover:bg-secondary/40`}
            >
              {body}
            </a>
          ) : (
            <div key={label} className={className}>
              {body}
            </div>
          );
        })}
      </div>

      <div className="mt-10 rounded-xl border border-border p-6">
        <h2 className="font-serif text-xl font-semibold">Stay Updated</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Never miss new collections, exclusive launches, limited editions and
          exciting offers.
        </p>
        <div className="mt-4">
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
