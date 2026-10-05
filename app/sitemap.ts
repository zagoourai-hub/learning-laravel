import type { MetadataRoute } from "next";
import { getAllLessons, getModules } from "@/lib/content";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/` },
    { url: `${SITE_URL}/belajar/` },
    { url: `${SITE_URL}/tentang/` },
    ...getModules().map((m) => ({ url: `${SITE_URL}/belajar/${m.id}/` })),
    ...getAllLessons().map((l) => ({ url: `${SITE_URL}${l.url}`, lastModified: l.lastVerified })),
  ];
}
