import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(135deg, #0F2D52 0%, #070F1E 100%)",
          color: "#fff",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 14,
            fontSize: 34,
            fontWeight: 700,
            letterSpacing: -0.5,
          }}
        >
          <div
            style={{
              display: "flex",
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#F59E0B",
            }}
          />
          BEIPOREADY
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", fontSize: 58, fontWeight: 700, lineHeight: 1.15, maxWidth: 980 }}>
            India&apos;s Leading SME IPO Advisor &amp; Growth Capital Expert
          </div>
          <div style={{ display: "flex", fontSize: 26, color: "rgba(255,255,255,0.65)" }}>
            IPO Readiness · Pre-IPO Advisory · NSE Emerge &amp; BSE SME Listings
          </div>
        </div>

        <div style={{ display: "flex", gap: 12 }}>
          {["NSE Emerge", "BSE SME"].map((badge) => (
            <div
              key={badge}
              style={{
                display: "flex",
                fontSize: 22,
                fontWeight: 600,
                color: "rgba(255,255,255,0.85)",
                border: "1px solid rgba(245,158,11,0.4)",
                borderRadius: 999,
                padding: "8px 22px",
              }}
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}
