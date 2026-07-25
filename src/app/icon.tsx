import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Generated app/favicon icon — PULSE monogram on ink. */
export default function Icon() {
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
          fontSize: 40,
          fontWeight: 700,
          fontFamily: "serif",
          borderRadius: 12,
        }}
      >
        P<span style={{ color: "#c08a2d" }}>.</span>
      </div>
    ),
    { ...size },
  );
}
