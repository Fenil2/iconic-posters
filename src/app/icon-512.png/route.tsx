import { ImageResponse } from "next/og";

/** Manifest PWA icon (512×512), generated on the fly. */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0a0a0a",
          color: "#fafaf8",
          fontSize: 300,
          fontWeight: 700,
          fontFamily: "serif",
        }}
      >
        I<span style={{ color: "#c08a2d" }}>.</span>
      </div>
    ),
    { width: 512, height: 512 },
  );
}
