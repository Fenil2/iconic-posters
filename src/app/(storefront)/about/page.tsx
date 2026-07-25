import type { Metadata } from "next";
import { ProsePage } from "@/components/shared/prose-page";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "About Iconik Posters",
  description:
    "Iconik Posters creates premium wall posters inspired by movies, anime, gaming, sports, music, automobiles and art — helping people turn ordinary walls into extraordinary spaces.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <ProsePage title="About Iconik Posters" subtitle="Walls tell stories.">
      <p>
        At {siteConfig.name}, we believe every room deserves personality.
        That&rsquo;s why we create premium posters inspired by the worlds people
        love — movies, anime, gaming, sports, music, automobiles, art and much
        more.
      </p>
      <h2>Our goal is simple</h2>
      <p>
        To help people transform ordinary walls into extraordinary spaces.
      </p>
      <p>
        Every poster is crafted with attention to detail, premium materials and
        high-quality printing to ensure your favourite artwork looks stunning
        for years.
      </p>
      <p>
        Whether you&rsquo;re decorating your first room or upgrading your dream
        setup, {siteConfig.name} is here to make every wall iconic.
      </p>
      <h2>What you can count on</h2>
      <ul>
        <li>Premium print quality on every single order.</li>
        <li>Vibrant, fade-resistant colours and sharp detail.</li>
        <li>Multiple sizes, secure packaging and fast shipping across India.</li>
        <li>New designs added regularly.</li>
      </ul>
      <p>
        Thanks for being here. Tag us{" "}
        <strong>{siteConfig.social.instagramHandle}</strong> — we love seeing our
        art on your walls.
      </p>
    </ProsePage>
  );
}
