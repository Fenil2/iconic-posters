"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { megaMenu, primaryNav } from "@/config/navigation";
import { Logo } from "./logo";

export function MobileNav({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-full p-0 sm:max-w-sm">
        <SheetHeader>
          <SheetTitle asChild>
            <Logo />
          </SheetTitle>
        </SheetHeader>

        <nav className="flex-1 overflow-y-auto scrollbar-thin px-2 py-4">
          <Accordion type="single" collapsible>
            {megaMenu.map((cat) => (
              <AccordionItem key={cat.slug} value={cat.slug} className="px-2">
                <AccordionTrigger className="text-base">
                  <span className="flex items-center gap-3">
                    <cat.icon className="size-4 text-muted-foreground" />
                    {cat.label}
                  </span>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col gap-1 pl-7">
                    <Link
                      href={`/category/${cat.slug}`}
                      onClick={close}
                      className="py-1.5 text-sm font-medium"
                    >
                      Shop all {cat.label}
                    </Link>
                    {cat.columns.flatMap((col) =>
                      col.links.map((l) => (
                        <Link
                          key={l.href}
                          href={l.href}
                          onClick={close}
                          className="py-1.5 text-sm text-muted-foreground"
                        >
                          {l.label}
                        </Link>
                      )),
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-4 border-t px-2 pt-4">
            {primaryNav.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={close}
                className="flex items-center justify-between py-2.5 text-sm font-medium"
              >
                {l.label}
                <ChevronRight className="size-4 text-muted-foreground" />
              </Link>
            ))}
          </div>

          <div className="mt-4 border-t px-2 pt-4">
            <Link
              href="/track-order"
              onClick={close}
              className="flex items-center justify-between py-2.5 text-sm"
            >
              Track order <ChevronRight className="size-4" />
            </Link>
            <Link
              href="/account"
              onClick={close}
              className="flex items-center justify-between py-2.5 text-sm"
            >
              My account <ChevronRight className="size-4" />
            </Link>
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
