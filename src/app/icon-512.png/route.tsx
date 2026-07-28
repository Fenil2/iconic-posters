import { ImageResponse } from "next/og";
import { BrandMark } from "@/components/shared/brand-mark";

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
          background: "#000000",
        }}
      >
        <BrandMark width={260} />
      </div>
    ),
    { width: 512, height: 512 },
  );
}
