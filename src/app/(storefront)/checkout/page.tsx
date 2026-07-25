import type { Metadata } from "next";
import { CheckoutClient } from "@/components/checkout/checkout-client";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false },
};

// Access is enforced by middleware (redirects guests to /login).
export default function CheckoutPage() {
  return <CheckoutClient />;
}
