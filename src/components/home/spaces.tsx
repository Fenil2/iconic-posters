import {
  Bed,
  Sofa,
  Gamepad2,
  Laptop,
  BookOpen,
  Coffee,
  Building2,
  Palette,
} from "@/components/icons";
import { SectionHeading } from "@/components/shared/section-heading";

const spaces = [
  { label: "Bedroom", icon: Bed },
  { label: "Living Room", icon: Sofa },
  { label: "Gaming Room", icon: Gamepad2 },
  { label: "Workspace", icon: Laptop },
  { label: "Study Room", icon: BookOpen },
  { label: "Café", icon: Coffee },
  { label: "Office", icon: Building2 },
  { label: "Studio", icon: Palette },
];

/** "Built For Every Space" — room-type quick reference. */
export function Spaces() {
  return (
    <section className="space-y-8">
      <SectionHeading
        eyebrow="Anywhere it hangs"
        title="Built For Every Space"
        description="There’s always a poster that fits perfectly."
        align="center"
      />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {spaces.map(({ label, icon: Icon }) => (
          <div
            key={label}
            className="flex flex-col items-center gap-3 rounded-xl border border-border p-6 text-center"
          >
            <span className="grid size-12 place-items-center rounded-full bg-secondary">
              <Icon className="size-5" />
            </span>
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
