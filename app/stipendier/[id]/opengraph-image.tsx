import { ImageResponse } from "next/og";
import { hamtaStipendium } from "@/app/actions";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const s = await hamtaStipendium(id);

  const namn = s?.namn ?? "Stipendiesök";
  const organisation = s?.organisation ?? "";
  const belopp = s?.belopp
    ? `${s.belopp.toLocaleString("sv-SE")} kr`
    : null;

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(135deg, #eff6ff 0%, #f9fafb 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "64px",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 20,
            color: "#3b82f6",
            fontWeight: 600,
            marginBottom: 24,
            textTransform: "uppercase",
            letterSpacing: 2,
          }}
        >
          Stipendiesök
        </div>
        <div
          style={{
            fontSize: 56,
            fontWeight: 800,
            color: "#111827",
            lineHeight: 1.15,
            marginBottom: 20,
          }}
        >
          {namn}
        </div>
        {organisation && (
          <div style={{ fontSize: 28, color: "#6b7280", marginBottom: 32 }}>
            {organisation}
          </div>
        )}
        {belopp && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              background: "#dbeafe",
              borderRadius: 12,
              padding: "12px 24px",
              width: "fit-content",
              fontSize: 24,
              fontWeight: 700,
              color: "#1d4ed8",
            }}
          >
            {belopp}
          </div>
        )}
      </div>
    ),
    size
  );
}
