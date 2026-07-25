import type { Metadata } from "next";
import { ProsePage } from "@/components/shared/prose-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Our Story",
  description: `About ${siteConfig.name} — a premium poster studio.`,
};

export default function AboutPage() {
  return (
    <ProsePage title="Our Story" subtitle="Museum-grade prints for walls with something to say.">
      <p>
        {siteConfig.name} began with a simple obsession: the machines, the icons and
        the worlds we grew up loving — bikes, cars, silver-screen legends, wild
        landscapes and anime — deserve to hang on your wall in the quality they deserve.
      </p>
      <p>
        Every poster is designed in-house and printed on archival, acid-free stock with
        pigment inks rated for 100+ years of fade resistance. No mass-market compromises —
        just considered art, printed properly, shipped safely.
      </p>
      <h2>What we stand for</h2>
      <ul>
        <li>Archival quality as standard, never an upsell.</li>
        <li>Honest pricing and fast, tracked delivery across India.</li>
        <li>Designs you won’t find anywhere else.</li>
      </ul>
      <p>
        Thanks for being here. Tag us <strong>@pulse.posters</strong> — we love seeing
        our art on your walls.
      </p>
    </ProsePage>
  );
}
