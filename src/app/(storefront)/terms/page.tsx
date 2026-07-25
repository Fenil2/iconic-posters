import type { Metadata } from "next";
import { ProsePage } from "@/components/shared/prose-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Terms of Service" };

export default function TermsPage() {
  return (
    <ProsePage title="Terms of Service" subtitle="Last updated: July 2026">
      <p>By using {siteConfig.name}, you agree to these terms.</p>
      <h2>Orders</h2>
      <p>All orders are subject to acceptance and availability. Prices are in INR and inclusive of applicable taxes unless stated otherwise.</p>
      <h2>Intellectual property</h2>
      <p>All artwork, designs and content are the property of {siteConfig.legalName} and may not be reproduced or resold without permission.</p>
      <h2>Cancellations</h2>
      <p>Orders can be cancelled before dispatch. Made-to-order items cannot be cancelled once production begins.</p>
      <h2>Liability</h2>
      <p>Our liability is limited to the value of the products purchased. See our Returns policy for damaged goods.</p>
      <h2>Contact</h2>
      <p>Questions? Email {siteConfig.contact.email}.</p>
    </ProsePage>
  );
}
