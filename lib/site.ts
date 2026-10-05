export const SITE_NAME = "Laravel Belajar";
export const SITE_DESCRIPTION =
  "Belajar Laravel 13 dari nol dalam Bahasa Indonesia: CRUD full controller untuk pemula, lalu lanjut ke Service Pattern.";

// Vercel sets VERCEL_PROJECT_PRODUCTION_URL at build time, so no env setup is needed there.
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
