"use client";

import { useState } from "react";
import { resetProgress } from "@/lib/progress";

export function ResetProgressButton() {
  const [done, setDone] = useState(false);
  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={() => {
          if (confirm("Hapus semua progres belajar di perangkat ini?")) {
            resetProgress();
            setDone(true);
          }
        }}
        className="min-h-11 rounded-md border border-border px-4 text-sm font-semibold hover:border-accent hover:text-accent"
      >
        Reset progres
      </button>
      <span className="text-sm text-muted" aria-live="polite">
        {done ? "Progres sudah direset." : ""}
      </span>
    </div>
  );
}
