"use client";

import { useEffect, useRef } from "react";

const config = {
  repo: process.env.NEXT_PUBLIC_GISCUS_REPO,
  "repo-id": process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
  "category-id": process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
};
const enabled = Object.values(config).every(Boolean);

const theme = () => (document.documentElement.classList.contains("dark") ? "dark" : "light");

export function Comments() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const s = document.createElement("script");
        s.src = "https://giscus.app/client.js";
        s.async = true;
        s.crossOrigin = "anonymous";
        const attrs = {
          ...config,
          mapping: "pathname",
          strict: "1",
          "reactions-enabled": "1",
          "emit-metadata": "0",
          "input-position": "top",
          theme: theme(),
          lang: "id",
          loading: "lazy",
        };
        for (const [k, v] of Object.entries(attrs)) s.setAttribute(`data-${k}`, v as string);
        el.appendChild(s);
      },
      { rootMargin: "400px" },
    );
    io.observe(el);

    const mo = new MutationObserver(() => {
      el.querySelector<HTMLIFrameElement>("iframe.giscus-frame")?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: theme() } } },
        "https://giscus.app",
      );
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  if (!enabled) return <p className="text-sm text-muted">Diskusi belum diaktifkan.</p>;
  return <div ref={ref} className="giscus min-h-24" />;
}
