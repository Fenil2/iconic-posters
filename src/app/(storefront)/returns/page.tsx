import type { Metadata } from "next";
import { ProsePage } from "@/components/shared/prose-page";

export const metadata: Metadata = { title: "Returns & Refunds" };

export default function ReturnsPage() {
  return (
    <ProsePage title="Returns & Refunds" subtitle="Simple, fair and quick.">
      <h2>7-day returns</h2>
      <p>Unframed prints can be returned within 7 days of delivery in original, unused condition. Refunds are processed to the original payment method within 5–7 business days of pickup.</p>
      <h2>Made-to-order items</h2>
      <p>Framed pieces and limited editions are produced on demand and are non-returnable unless they arrive damaged or defective.</p>
      <h2>Damaged in transit?</h2>
      <ul>
        <li>Email us within 48 hours with photos of the item and packaging.</li>
        <li>We’ll arrange a free replacement or full refund — your choice.</li>
      </ul>
      <h2>How to start a return</h2>
      <p>Go to your account → Orders → select the order → Request return. Our team will confirm pickup within a day.</p>
    </ProsePage>
  );
}
