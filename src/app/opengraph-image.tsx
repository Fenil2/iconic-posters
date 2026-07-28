import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/shared/brand-mark";
import { siteConfig } from "@/config/site";

export const runtime = "edge";
export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 56,
          background: "#000000",
          color: "#ffffff",
        }}
      >
        <BrandMark width={190} />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 128,
              fontWeight: 700,
              lineHeight: 1,
              letterSpacing: "0.01em",
            }}
          >
            ICONIK
          </div>
          <div
            style={{
              fontSize: 42,
              fontWeight: 700,
              letterSpacing: "0.36em",
              marginTop: 10,
            }}
          >
            POSTERS
          </div>
          <div style={{ fontSize: 28, color: "#a3a3a3", marginTop: 22 }}>
            {siteConfig.tagline}
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
