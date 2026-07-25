import type { Metadata } from "next";
import { ProsePage } from "@/components/shared/prose-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <ProsePage title="Privacy Policy" subtitle="Last updated: July 2026">
      <p>{siteConfig.legalName} (“we”) respects your privacy. This policy explains what we collect and how we use it.</p>
      <h2>What we collect</h2>
      <ul>
        <li>Account details: name, email, phone.</li>
        <li>Order & shipping information you provide at checkout.</li>
        <li>Usage data via analytics (Google Analytics, Meta Pixel).</li>
      </ul>
      <h2>How we use it</h2>
      <p>To process orders, provide support, prevent fraud, and improve the store. We never sell your personal data.</p>
      <h2>Payments</h2>
      <p>Payments are processed securely by Razorpay/Stripe. We do not store your full card details.</p>
      <h2>Your rights</h2>
      <p>You can request access to, correction of, or deletion of your data by emailing {siteConfig.contact.email}.</p>
    </ProsePage>
  );
}
