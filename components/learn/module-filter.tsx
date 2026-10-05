"use client";

import { useEffect, useState, type ReactNode } from "react";
import { LessonGrid, type GridModule } from "./lesson-grid";
import { GridBanner } from "./grid-banner";

// The site is a static export, so the filter state lives on the client and is mirrored to ?modul=<id>.
export function ModuleFilter({ modules, header, resume }: { modules: GridModule[]; header: ReactNode; resume: ReactNode }) {
  const [selected, setSelected] = useState("semua");

  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("modul");
    if (id && modules.some((m) => m.id === id)) setSelected(id);
  }, [modules]);

  function choose(id: string) {
    setSelected(id);
    history.replaceState(null, "", id === "semua" ? window.location.pathname : `?modul=${id}`);
  }

  const total = modules.reduce((n, m) => n + m.lessons.length, 0);
  const chips = [{ id: "semua", title: "Semua", count: total }, ...modules.map((m) => ({ id: m.id, title: m.title, count: m.lessons.length }))];
  const visible = selected === "semua" ? modules : modules.filter((m) => m.id === selected);
  const shown = visible.reduce((n, m) => n + m.lessons.length, 0);

  return (
    <div className="relative min-h-screen bg-background">
      <GridBanner />
      <div className="relative z-10 flex min-h-[250px] flex-col justify-center gap-6 border-b border-border p-6">
        <div className="mx-auto w-full max-w-7xl">{header}</div>
        <div className="mx-auto w-full max-w-7xl">
          <p className="sr-only" role="status">
            Menampilkan {shown} pelajaran
          </p>
          <div role="group" aria-label="Filter modul" className="flex flex-wrap gap-2">
            {chips.map((c) => {
              const on = selected === c.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={on}
                  onClick={() => choose(c.id)}
                  className={`flex h-10 items-center rounded-lg border px-1 pl-3 text-sm transition-colors duration-150 motion-reduce:transition-none sm:h-8 ${
                    on ? "border-foreground bg-foreground text-background" : "border-border-strong hover:bg-surface-2"
                  }`}
                >
                  <span>{c.title}</span>
                  {c.count > 0 && (
                    <span
                      className={`ml-2 flex h-6 min-w-6 items-center justify-center rounded-md border px-1 text-xs font-medium ${
                        on ? "border-background/40 bg-background text-foreground" : "border-border"
                      }`}
                    >
                      {c.count}
                    </span>
                  )}
                  {c.count === 0 && <span className="pr-2" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-6 pt-6 empty:hidden lg:px-0">{resume}</div>

      <LessonGrid
        lessons={visible.flatMap((m) => m.lessons)}
        soon={visible.filter((m) => m.comingSoon || m.lessons.length === 0)}
      />
    </div>
  );
}
