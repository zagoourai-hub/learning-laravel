"use client";

import { toggleComplete, useProgress } from "@/lib/progress";

export function CompleteButton({ id }: { id: string }) {
  const done = Boolean(useProgress().completed[id]);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={() => toggleComplete(id)}
        aria-pressed={done}
        className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md px-5 text-sm font-semibold transition-[color,background-color,opacity,transform] duration-150 active:translate-y-px motion-reduce:transition-none motion-reduce:active:translate-y-0 sm:min-w-64 ${
          done
            ? "border border-success text-success hover:bg-surface-2"
            : "bg-accent text-accent-foreground hover:opacity-90"
        }`}
      >
        {done ? "✓ Selesai — batalkan tanda" : "Tandai pelajaran selesai"}
      </button>
      <span className="text-sm text-muted" aria-live="polite">
        {done ? "Progres tersimpan di perangkat ini." : ""}
      </span>
    </div>
  );
}
