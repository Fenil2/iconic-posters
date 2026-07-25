import type { Metadata } from "next";
import { ProsePage } from "@/components/shared/prose-page";

export const metadata: Metadata = { title: "Shipping & Delivery" };

export default function ShippingPage() {
  return (
    <ProsePage title="Shipping & Delivery" subtitle="Fast, tracked and carefully packed.">
      <h2>Processing & dispatch</h2>
      <p>Unframed prints are dispatched in 2–4 business days. Framed pieces are made to order and dispatch in 4–7 business days.</p>
      <h2>Delivery times</h2>
      <ul>
        <li>Metro cities: 2–4 business days after dispatch.</li>
        <li>Rest of India: 4–8 business days after dispatch.</li>
      </ul>
      <h2>Charges</h2>
      <p>Free shipping on orders over ₹999. Below that, a flat ₹79 applies. COD adds a small ₹49 handling fee.</p>
      <h2>Packaging</h2>
      <p>Prints ship rolled in rigid tubes; framed art ships in reinforced boxes with corner protection.</p>
    </ProsePage>
  );
}
