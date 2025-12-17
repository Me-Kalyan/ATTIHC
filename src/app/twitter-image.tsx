import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "ATTIHC";
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
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 100,
              fontWeight: 800,
              color: "#166534",
              letterSpacing: -4,
            }}
          >
            ATTIHC
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
