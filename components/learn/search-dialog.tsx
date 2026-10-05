"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { SearchEntry } from "@/lib/types";

type Hit = SearchEntry & { before: string; match: string; after: string };

type Filters = { moduleId: string; level: string };

// ponytail: linear scan over a static JSON index; fine for a few hundred sections, move to Pagefind when content grows.
function search(index: SearchEntry[], query: string, f: Filters): Hit[] {
  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (query.trim().length < 2) return [];
  const hits: Hit[] = [];
  for (const e of index) {
    if ((f.moduleId && e.moduleId !== f.moduleId) || (f.level && e.level !== f.level)) continue;
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
  const input = useRef<HTMLInputElement>(null);
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [filters, setFilters] = useState<Filters>({ moduleId: "", level: "" });
  const hits = index ? search(index, query, filters) : [];
  const modules = index ? [...new Map(index.map((e) => [e.moduleId, e.moduleTitle])).entries()] : [];

  function setFilter(key: keyof Filters, value: string) {
    setFilters((f) => ({ ...f, [key]: value }));
    setActive(0);
  }

  function load() {
    setError(false);
    fetch("/search-index.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setIndex)
      .catch(() => setError(true));
  }

  function open() {
    const d = dialog.current;
    if (!d) return;
    if (d.open) {
      // Ctrl/⌘ K again: just refocus the field instead of calling showModal() twice.
      input.current?.focus();
      input.current?.select();
      return;
    }
    d.showModal();
    if (!index) load();
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
    window.addEventListener("open-search", open);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("open-search", open);
    };
  });

  useEffect(() => {
    dialog.current?.querySelector(`[data-hit="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active, hits.length]);

  function onInputKey(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      // type="search" would use the first Escape to clear the field; close the dialog right away instead.
      e.preventDefault();
      close();
    } else if (e.key === "ArrowDown") {
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
        className="flex h-10 items-center gap-3 rounded-md border border-border-strong bg-surface px-3 text-sm text-muted transition-colors duration-150 hover:border-muted hover:text-foreground active:bg-surface-2 motion-reduce:transition-none"
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
            ref={input}
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
          <button type="button" onClick={close} className="min-h-9 rounded-md px-2.5 text-xs text-muted transition-colors duration-150 hover:bg-surface-2 motion-reduce:transition-none" aria-label="Tutup pencarian">
            Esc
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 border-b border-border px-4 py-2.5 text-sm sm:flex sm:flex-wrap sm:gap-x-4 sm:gap-y-2">
          <label className="flex min-w-0 flex-col gap-1 text-muted sm:flex-row sm:items-center sm:gap-2">
            Modul
            <select
              value={filters.moduleId}
              onChange={(e) => setFilter("moduleId", e.target.value)}
              className="h-10 w-full min-w-0 rounded-md sm:h-9 sm:max-w-[14rem] sm:w-auto border border-border-strong bg-background px-2 text-foreground"
            >
              <option value="">Semua</option>
              {modules.map(([id, title]) => (
                <option key={id} value={id}>
                  {title}
                </option>
              ))}
            </select>
          </label>
          <label className="flex min-w-0 flex-col gap-1 text-muted sm:flex-row sm:items-center sm:gap-2">
            Level
            <select
              value={filters.level}
              onChange={(e) => setFilter("level", e.target.value)}
              className="h-10 w-full rounded-md border border-border-strong bg-background px-2 text-foreground sm:h-9 sm:w-auto"
            >
              <option value="">Semua</option>
              <option value="pemula">Pemula</option>
              <option value="menengah">Menengah</option>
            </select>
          </label>
        </div>

        <div className="max-h-[60vh] overflow-y-auto overscroll-contain p-2" aria-live="polite">
          {error ? (
            <div className="px-3 py-8 text-center text-sm text-muted">
              <p>Indeks pencarian gagal dimuat.</p>
              <button
                type="button"
                onClick={load}
                className="mt-3 min-h-10 rounded-md border border-border-strong px-4 font-semibold text-foreground transition-colors duration-150 hover:bg-surface-2 motion-reduce:transition-none"
              >
                Coba lagi
              </button>
            </div>
          ) : !index ? (
            <p className="px-3 py-8 text-center text-sm text-muted">Memuat indeks…</p>
          ) : query.trim().length < 2 ? (
            <p className="px-3 py-8 text-center text-sm text-muted">Ketik minimal 2 huruf untuk mencari di semua pelajaran.</p>
          ) : hits.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-muted">Tidak ada hasil untuk “{query}”. Coba kata kunci lain atau ubah filter.</p>
          ) : (
            <>
              <p className="sr-only">{hits.length} hasil</p>
              <ul>
              {hits.map((h, i) => (
                <li key={h.url + i}>
                  <Link
                    href={h.url}
                    data-hit={i}
                    onClick={close}
                    onMouseEnter={() => setActive(i)}
                    aria-current={i === active ? "true" : undefined}
                    className={`block rounded-md px-3 py-2.5 transition-colors duration-100 motion-reduce:transition-none ${i === active ? "bg-surface-2" : ""}`}
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
            </>
          )}
        </div>
      </dialog>
    </>
  );
}
