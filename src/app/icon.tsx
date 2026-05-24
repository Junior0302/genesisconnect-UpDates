import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: "transparent",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FAF9F6",
          fontFamily: "Times New Roman, serif", // Fallback to serif
          letterSpacing: "-1px",
        }}
      >
        G·C
      </div>
    ),
    {
      ...size,
    }
  );
}
