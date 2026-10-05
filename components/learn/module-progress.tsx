"use client";

import { useProgress } from "@/lib/progress";

export function ModuleProgress({ lessonIds, label }: { lessonIds: string[]; label: string }) {
  const { completed } = useProgress();
  if (lessonIds.length === 0) return null;
  const done = lessonIds.filter((id) => completed[id]).length;
  const pct = Math.round((done / lessonIds.length) * 100);
  return (
    <div className="flex items-center gap-3 text-xs text-muted">
      <div
        role="progressbar"
        aria-label={`Progres ${label}`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2"
      >
        <div className="h-full bg-accent transition-[width]" style={{ width: `${pct}%` }} />
      </div>
      <span className="tabular-nums">
        {done}/{lessonIds.length} selesai
      </span>
    </div>
  );
}
