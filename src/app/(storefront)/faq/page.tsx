import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { safe } from "@/server/queries/content";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "FAQs",
  description:
    "Answers about shipping across India, delivery times, framing, poster sizes, Cash on Delivery and order tracking.",
  alternates: { canonical: "/faq" },
};

const FALLBACK = [
  { id: "1", question: "Do you ship across India?", answer: "Yes. We deliver across India.", category: "Shipping" },
  { id: "2", question: "How long does shipping take?", answer: "Orders are usually delivered within 3–7 business days depending on your location.", category: "Shipping" },
  { id: "3", question: "Are the posters framed?", answer: "We offer both framed and unframed options, depending on the product.", category: "Products" },
  { id: "4", question: "What sizes are available?", answer: "Multiple sizes are available. Please check the product page for details.", category: "Products" },
  { id: "5", question: "Is Cash on Delivery available?", answer: "Availability depends on your location.", category: "Payments" },
  { id: "6", question: "How can I track my order?", answer: "You'll receive tracking details once your order is shipped.", category: "Orders" },
];

export default async function FaqPage() {
  const rows = await safe(
    () => prisma.faq.findMany({ where: { isActive: true }, orderBy: { position: "asc" } }),
    [],
  );
  const faqs = rows.length ? rows : FALLBACK;

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="font-serif text-4xl font-semibold tracking-tight">
        Frequently Asked Questions
      </h1>
      <p className="mt-2 text-muted-foreground">
        Everything you need to know before you order.
      </p>

      <Accordion type="single" collapsible className="mt-10">
        {faqs.map((f) => (
          <AccordionItem key={f.id} value={f.id}>
            <AccordionTrigger className="text-left text-base">{f.question}</AccordionTrigger>
            <AccordionContent className="text-[15px]">{f.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
