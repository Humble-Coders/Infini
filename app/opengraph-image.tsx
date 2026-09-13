import { ImageResponse } from "next/og";

/**
 * Default social share image (1200×630) for every page without its own
 * document OG image. Rendered at request time on the edge from pure JSX —
 * no photo assets, no font downloads, nothing to go stale. Detail pages
 * with a cover image override this via their own metadata.
 */
export const runtime = "edge";
export const alt = "INFINI | Precision Surface-Finishing";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          padding: "96px",
          backgroundColor: "#0a0a0a",
          color: "#fafafa",
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        <div style={{ display: "flex", fontSize: 28, letterSpacing: 8, color: "#ff274a" }}>
          PRECISION SURFACE-FINISHING
        </div>
        <div style={{ display: "flex", fontSize: 120, fontWeight: 700, letterSpacing: -4, marginTop: 16 }}>
          INFINI
        </div>
        <div style={{ display: "flex", fontSize: 32, color: "#a3a3a3", marginTop: 16 }}>
          MMP treatment, validated in-house, verified before it ships.
        </div>
        <div
          style={{
            display: "flex",
            width: 160,
            height: 6,
            backgroundColor: "#ff274a",
            marginTop: 40,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
