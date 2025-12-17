import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ATTIHC - Advanced Task & Time Integrated Hub for Creators";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#FAF9F7",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 40,
          }}
        >
          {/* Logo representation */}
          <div
            style={{
              display: "flex",
              fontSize: 120,
              fontWeight: 800,
              color: "#166534",
              letterSpacing: -5,
            }}
          >
            ATTIHC
          </div>
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 600,
            color: "#1c1917",
            textAlign: "center",
            maxWidth: "80%",
            lineHeight: 1.2,
          }}
        >
          Advanced Task & Time Integrated Hub for Creators
        </div>
        <div
          style={{
            fontSize: 24,
            marginTop: 40,
            color: "#57534e",
          }}
        >
          Focus • Organize • Achieve
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
