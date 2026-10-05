import localFont from "next/font/local";

// Self-hosted (fontsource variable woff2): fonts.gstatic.com is unreachable at build time.

const jakarta = localFont({
  src: [
    { path: "../node_modules/@fontsource-variable/plus-jakarta-sans/files/plus-jakarta-sans-latin-wght-normal.woff2", weight: "200 800", style: "normal" },
  ],
  variable: "--font-jakarta",
  display: "swap",
});

const sourceSerif = localFont({
  src: [
    { path: "../node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-normal.woff2", weight: "200 900", style: "normal" },
    { path: "../node_modules/@fontsource-variable/source-serif-4/files/source-serif-4-latin-wght-italic.woff2", weight: "200 900", style: "italic" },
  ],
  variable: "--font-serif",
  display: "swap",
});

const jetbrainsMono = localFont({
  src: [
    { path: "../node_modules/@fontsource-variable/jetbrains-mono/files/jetbrains-mono-latin-wght-normal.woff2", weight: "100 800", style: "normal" },
  ],
  variable: "--font-code",
  display: "swap",
});

export const fontVariables = `${jakarta.variable} ${sourceSerif.variable} ${jetbrainsMono.variable}`;
