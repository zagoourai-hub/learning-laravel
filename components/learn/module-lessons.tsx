"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";

export function ModuleLessons({ lessons, currentId }: { lessons: { id: string; title: string; url: string }[]; currentId: string }) {
  const { completed } = useProgress();
  return (
    <ol className="space-y-1 text-sm">
      {lessons.map((l) => (
        <li key={l.id}>
          <Link
            href={l.url}
            aria-current={l.id === currentId ? "page" : undefined}
            className="flex min-h-10 items-center gap-2 rounded-md px-2 py-1.5 text-muted hover:bg-surface-2 hover:text-foreground aria-[current=page]:bg-surface-2 aria-[current=page]:font-medium aria-[current=page]:text-foreground"
          >
            <span className="flex-1 leading-snug">{l.title}</span>
            {completed[l.id] && (
              <svg className="size-4 shrink-0 text-success" viewBox="0 0 20 20" fill="currentColor" role="img" aria-label="Selesai">
                <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
              </svg>
            )}
          </Link>
        </li>
      ))}
    </ol>
  );
}
