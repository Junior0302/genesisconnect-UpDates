import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 100,
          background: "#2A1C15", // Dark background for Apple icon
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#FAF9F6",
          fontFamily: "Times New Roman, serif",
          letterSpacing: "-2px",
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
