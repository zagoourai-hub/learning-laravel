"use client";

import { useEffect, useRef, useState } from "react";

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
  const [loaded, setLoaded] = useState(false);

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

    const ready = new MutationObserver(() => {
      const frame = el.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
      if (!frame) return;
      ready.disconnect();
      frame.addEventListener("load", () => setLoaded(true), { once: true });
    });
    ready.observe(el, { childList: true, subtree: true });
    const giveUp = setTimeout(() => setLoaded(true), 10000);

    const mo = new MutationObserver(() => {
      el.querySelector<HTMLIFrameElement>("iframe.giscus-frame")?.contentWindow?.postMessage(
        { giscus: { setConfig: { theme: theme() } } },
        "https://giscus.app",
      );
    });
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      io.disconnect();
      ready.disconnect();
      clearTimeout(giveUp);
      mo.disconnect();
    };
  }, []);

  if (!enabled) return <p className="text-sm text-muted">Diskusi belum diaktifkan.</p>;
  // Reserve space and show a placeholder until the widget has loaded, so the page does not jump.
  return (
    <div className={`relative ${loaded ? "" : "min-h-64"}`}>
      {!loaded && (
        <div
          aria-hidden
          className="absolute inset-0 flex items-start rounded-md border border-border bg-surface-2/60 p-4 text-sm text-muted motion-safe:animate-pulse"
        >
          Memuat diskusi…
        </div>
      )}
      <div ref={ref} className="giscus relative" />
    </div>
  );
}
