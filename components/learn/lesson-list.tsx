"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";

type Item = { id: string; title: string; url: string; order: number; estimatedMinutes: number };

export function LessonList({ lessons }: { lessons: Item[] }) {
  const { completed } = useProgress();
  return (
    <ol className="mt-10 divide-y divide-border border-y border-border">
      {lessons.map((l) => (
        <li key={l.id}>
          <Link href={l.url} className="group grid grid-cols-[2.5rem_minmax(0,1fr)_auto] items-baseline gap-3 py-5">
            <span className="font-mono text-sm text-muted">{String(l.order).padStart(2, "0")}</span>
            <span className="font-heading font-semibold group-hover:text-accent">{l.title}</span>
            <span className="text-sm text-muted">
              {completed[l.id] ? <span className="font-medium text-success">Selesai</span> : `± ${l.estimatedMinutes} menit`}
            </span>
          </Link>
        </li>
      ))}
    </ol>
  );
}
