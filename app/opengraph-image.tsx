import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Static export: rendered once at build time.
export const dynamic = "force-static";
export const alt = "Laravel Belajar — Tutorial Laravel 13 berbahasa Indonesia";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// ImageResponse can't parse woff2, so use the static .woff files from @fontsource/plus-jakarta-sans.
const fontDir = join(process.cwd(), "node_modules/@fontsource/plus-jakarta-sans/files");
const font = (weight: 400 | 800) => readFile(join(fontDir, `plus-jakarta-sans-latin-${weight}-normal.woff`));

export default async function Image() {
  const [regular, extrabold] = await Promise.all([font(400), font(800)]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#0f1720",
          fontFamily: "Jakarta",
          color: "#e7e5e4",
          borderLeft: "16px solid #ff6b5e",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "12px",
              background: "#c8231a",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
              fontWeight: 800,
            }}
          >
            L
          </div>
          <div style={{ fontSize: "28px", color: "#a8a29e" }}>Laravel 13 · Bahasa Indonesia</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div style={{ fontSize: "104px", fontWeight: 800, letterSpacing: "0.02em", lineHeight: 1 }}>
            LARAVEL BELAJAR
          </div>
          <div style={{ fontSize: "40px", color: "#e7e5e4" }}>Tutorial Laravel 13 berbahasa Indonesia</div>
        </div>
        <div style={{ fontSize: "24px", color: "#a8a29e" }}>dibuat oleh zagoours</div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Jakarta", data: regular, weight: 400, style: "normal" },
        { name: "Jakarta", data: extrabold, weight: 800, style: "normal" },
      ],
    },
  );
}
