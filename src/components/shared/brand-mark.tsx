/**
 * The Iconik stencil poster mark, drawn with plain boxes so it renders inside
 * `next/og` ImageResponse (satori) where the PNG artwork isn't reachable.
 * Shared by the favicon, PWA icons and the Open Graph image.
 */
export function BrandMark({
  width,
  ink = "#ffffff",
}: {
  width: number;
  ink?: string;
}) {
  const stroke = Math.max(2, Math.round(width * 0.085));
  return (
    <div
      style={{
        display: "flex",
        width,
        height: Math.round(width * 1.24),
        border: `${stroke}px solid ${ink}`,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: Math.round(width * 0.86),
          lineHeight: 1,
          fontWeight: 700,
          color: ink,
          fontFamily: "serif",
        }}
      >
        I
      </div>
    </div>
  );
}
