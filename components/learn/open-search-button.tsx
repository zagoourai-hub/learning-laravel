"use client";

export function OpenSearchButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event("open-search"))}
      className="inline-flex min-h-11 items-center rounded-md border border-border px-5 text-sm font-semibold hover:border-muted"
    >
      Cari pelajaran
    </button>
  );
}
