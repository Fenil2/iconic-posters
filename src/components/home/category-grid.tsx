import Link from "next/link";
import { categoryIcons } from "@/config/navigation";

/** Icon-led category quick nav (Flipkart-style rail, gallery styling). */
export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-[1400px] px-4">
      <div className="no-scrollbar flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-5 sm:gap-4 lg:grid-cols-10">
        {categoryIcons.map(({ label, href, icon: Icon }) => (
          <Link
            key={label}
            href={href}
            className="group flex min-w-[76px] shrink-0 flex-col items-center gap-2 rounded-xl border border-transparent p-3 transition-colors hover:border-border hover:bg-secondary/50"
          >
            <span className="grid size-14 place-items-center rounded-full bg-secondary transition-transform group-hover:scale-105">
              <Icon className="size-6" />
            </span>
            <span className="text-center text-xs font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
