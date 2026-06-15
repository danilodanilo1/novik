import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const alt = `${siteConfig.name} - ${siteConfig.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          background: "linear-gradient(135deg, #050505 0%, #1a0000 50%, #050505 100%)",
          padding: 80,
        }}
      >
        <p
          style={{
            color: "#dc2626",
            fontSize: 28,
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            marginBottom: 24,
          }}
        >
          {siteConfig.role}
        </p>
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "white",
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
          }}
        >
          MATHEUS
        </div>
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: "#d4d4d8",
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            marginLeft: 80,
          }}
        >
          NASCIMENTO
        </div>
        <p style={{ color: "#a1a1aa", fontSize: 28, marginTop: 40, maxWidth: 800 }}>
          Premiere · After Effects · ElevenLabs · YouTube · Reels · eSports
        </p>
      </div>
    ),
    { ...size },
  );
}
