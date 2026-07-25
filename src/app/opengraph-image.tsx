import { ImageResponse } from "next/og";
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#fafaf8",
          fontFamily: "serif",
        }}
      >
        <div style={{ fontSize: 140, fontWeight: 700, letterSpacing: "-0.04em" }}>
          PULSE<span style={{ color: "#c08a2d" }}>.</span>
        </div>
        <div style={{ fontSize: 34, color: "#a3a3a3", marginTop: 8 }}>
          {siteConfig.tagline}
        </div>
      </div>
    ),
    { ...size },
  );
}
