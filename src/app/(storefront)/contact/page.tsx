import type { Metadata } from "next";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { NewsletterForm } from "@/components/shared/newsletter-form";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with the ${siteConfig.name} studio.`,
};

export default function ContactPage() {
  const items = [
    { icon: Mail, label: "Email", value: siteConfig.contact.email },
    { icon: Phone, label: "Phone", value: siteConfig.contact.phone },
    { icon: Clock, label: "Hours", value: siteConfig.contact.supportHours },
    { icon: MapPin, label: "Studio", value: siteConfig.contact.address },
  ];
  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-4xl font-semibold tracking-tight">Contact Us</h1>
      <p className="mt-2 text-muted-foreground">
        Questions about an order, sizing or a custom commission? We’re here.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2">
        {items.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3 rounded-xl border border-border p-5">
            <span className="grid size-10 shrink-0 place-items-center rounded-full bg-secondary">
              <Icon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-sm text-muted-foreground">{value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 rounded-xl border border-border p-6">
        <h2 className="font-serif text-xl font-semibold">Prefer email updates?</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Join the list for new drops and 10% off your first order.
        </p>
        <div className="mt-4">
          <NewsletterForm />
        </div>
      </div>
    </div>
  );
}
