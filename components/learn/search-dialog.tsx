"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SearchEntry } from "@/lib/types";

type Hit = SearchEntry & { before: string; match: string; after: string };

// ponytail: linear scan over a static JSON index; fine for a few hundred sections, move to Pagefind when content grows.
function search(index: SearchEntry[], query: string): Hit[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const hits: Hit[] = [];
  for (const e of index) {
    const hay = `${e.lessonTitle} ${e.heading} ${e.text}`.toLowerCase();
    if (!terms.every((t) => hay.includes(t))) continue;
    const at = e.text.toLowerCase().indexOf(terms[0]);
    const start = Math.max(0, at - 60);
    hits.push({
      ...e,
      before: at < 0 ? e.text.slice(0, 140) : (start > 0 ? "…" : "") + e.text.slice(start, at),
      match: at < 0 ? "" : e.text.slice(at, at + terms[0].length),
      after: at < 0 ? "" : e.text.slice(at + terms[0].length, at + 80) + "…",
    });
    if (hits.length === 20) break;
  }
  return hits;
}

export function SearchDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const hits = index ? search(index, query) : [];

  function open() {
    dialog.current?.showModal();
    if (!index) {
      fetch("/search-index.json")
        .then((r) => (r.ok ? r.json() : Promise.reject()))
        .then(setIndex)
        .catch(() => setError(true));
    }
  }

  function close() {
    dialog.current?.close();
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        open();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Enter" && hits[active]) {
      e.preventDefault();
      dialog.current?.querySelector<HTMLAnchorElement>(`[data-hit="${active}"]`)?.click();
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={open}
        className="flex h-10 items-center gap-3 rounded-md border border-border bg-surface px-3 text-sm text-muted transition-colors hover:border-muted hover:text-foreground"
        aria-label="Cari materi (Ctrl K)"
      >
        <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <span className="hidden sm:inline">Cari…</span>
        <kbd className="hidden rounded border border-border px-1.5 font-mono text-[0.7rem] sm:inline">Ctrl K</kbd>
      </button>

      <dialog
        ref={dialog}
        aria-label="Cari materi"
        onClick={(e) => e.target === dialog.current && close()}
        className="mx-auto mt-[10vh] w-[min(40rem,calc(100vw-2rem))] rounded-lg border border-border bg-surface p-0 text-foreground shadow-xl backdrop:bg-black/40"
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <svg className="size-4 shrink-0 text-muted" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            autoFocus
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            placeholder="Contoh: route model binding, 419, sweetalert"
            aria-label="Kata kunci"
            className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
          />
          <button type="button" onClick={close} className="rounded-md px-2 py-1 text-xs text-muted hover:bg-surface-2" aria-label="Tutup pencarian">
            Esc
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2" aria-live="polite">
          {error ? (
            <p className="px-3 py-8 text-center text-sm text-muted">Indeks pencarian gagal dimuat. Coba muat ulang halaman.</p>
          ) : !index ? (
            <p className="px-3 py-8 text-center text-sm text-muted">Memuat indeks…</p>
          ) : !query.trim() ? (
            <p className="px-3 py-8 text-center text-sm text-muted">Ketik kata kunci untuk mencari di semua pelajaran.</p>
          ) : hits.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted">Tidak ada hasil untuk “{query}”.</p>
          ) : (
            <ul>
              {hits.map((h, i) => (
                <li key={h.url + i}>
                  <Link
                    href={h.url}
                    data-hit={i}
                    onClick={close}
                    onMouseEnter={() => setActive(i)}
                    className={`block rounded-md px-3 py-2.5 ${i === active ? "bg-surface-2" : ""}`}
                  >
                    <span className="block text-xs text-muted">{h.moduleTitle} · {h.lessonTitle}</span>
                    <span className="block font-heading text-sm font-semibold">{h.heading || h.lessonTitle}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-muted">
                      {h.before}
                      {h.match && <mark className="rounded-sm bg-accent/15 px-0.5 text-foreground">{h.match}</mark>}
                      {h.after}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </dialog>
    </>
  );
}
