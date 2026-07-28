import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/shared/brand-mark";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

/** Generated app/favicon icon — the Iconik stencil poster mark on ink. */
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
          background: "#000000",
          borderRadius: 12,
        }}
      >
        <BrandMark width={32} />
      </div>
    ),
    { ...size },
  );
}
