import { ImageResponse } from "next/og";
import { brand } from "@/config/settings.mjs";

export const alt = `${brand.name} | Consulenza commerciale luce e gas`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Anteprima per WhatsApp, LinkedIn e social: stessi colori del sito (crema, salvia, bordeaux)
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "0 90px",
          background: "#f6f0e4",
          borderLeft: "24px solid #7b2f3d",
        }}
      >
        <div style={{ fontSize: 30, color: "#4d6446", letterSpacing: 4, textTransform: "uppercase" }}>
          Luce e gas
        </div>
        <div style={{ fontSize: 88, fontWeight: 700, color: "#2c3b2a", marginTop: 16, lineHeight: 1.05 }}>
          {brand.name}
        </div>
        <div style={{ fontSize: 38, color: "#3e3a34", marginTop: 28, lineHeight: 1.3 }}>
          Consulenza commerciale per aziende, professionisti e privati
        </div>
        <div style={{ fontSize: 30, color: "#7b2f3d", marginTop: 44 }}>{brand.consultantName}</div>
      </div>
    ),
    size
  );
}
