"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useProgress } from "@/lib/progress";

export type CardLesson = {
  id: string;
  title: string;
  description: string;
  url: string;
  moduleTitle: string;
  level: "pemula" | "menengah";
  estimatedMinutes: number;
};

// Hairline dividers come from the pseudo-elements, as in the Magic UI blog card.
const cell =
  "group block relative before:absolute before:-left-0.5 before:top-0 before:z-10 before:h-screen before:w-px before:bg-border before:content-[''] after:absolute after:-top-0.5 after:left-0 after:z-0 after:h-px after:w-screen after:bg-border after:content-['']";

export function LessonCard({ lesson, showRightBorder = true }: { lesson: CardLesson; showRightBorder?: boolean }) {
  const done = Boolean(useProgress().completed[lesson.id]);
  return (
    <Link href={lesson.url} className={cn(cell, showRightBorder && "border-b-0 border-border md:border-r")}>
      <div className="flex flex-col gap-2 p-6">
        <h3 className="text-lg text-foreground underline-offset-4 group-hover:underline">{lesson.title}</h3>
        <p className="text-sm leading-relaxed text-muted">{lesson.description}</p>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-medium text-muted">
          <span>{lesson.moduleTitle}</span>
          <span>{lesson.level === "pemula" ? "Pemula" : "Menengah"}</span>
          <span>± {lesson.estimatedMinutes} menit</span>
          {done && (
            <span className="inline-flex items-center gap-1 text-success">
              <svg className="size-3.5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
              </svg>
              Selesai
            </span>
          )}
        </p>
      </div>
    </Link>
  );
}

export function ComingSoonCard({ title, order, showRightBorder = true }: { title: string; order: number; showRightBorder?: boolean }) {
  return (
    <div className={cn(cell, "opacity-70", showRightBorder && "border-b-0 border-border md:border-r")}>
      <div className="flex flex-col gap-2 p-6">
        <h3 className="text-lg text-muted">{title}</h3>
        <p className="text-sm text-muted">
          Modul {String(order).padStart(2, "0")} · Segera hadir
        </p>
      </div>
    </div>
  );
}
