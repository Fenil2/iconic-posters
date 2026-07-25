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
  description: "Answers about our prints, shipping, returns and more.",
};

const FALLBACK = [
  { id: "1", question: "What paper do you print on?", answer: "Archival, acid-free 200–260gsm stock with pigment inks rated for 100+ years.", category: "Products" },
  { id: "2", question: "How long does delivery take?", answer: "Unframed prints ship in 2–4 business days; framed in 4–7 days, with tracking.", category: "Shipping" },
  { id: "3", question: "What is your return policy?", answer: "7-day returns on unframed prints in original condition. Framed & limited editions are made-to-order.", category: "Returns" },
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
