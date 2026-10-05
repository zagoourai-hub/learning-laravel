"use client";

export function OpenSearchButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-search"))}
      className="inline-flex min-h-11 items-center rounded-md border border-border-strong px-5 text-sm font-semibold transition-colors duration-150 hover:border-muted hover:bg-surface-2 active:bg-surface-2 motion-reduce:transition-none"
    >
      Cari pelajaran
    </button>
  );
}
