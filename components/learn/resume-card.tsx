"use client";

import Link from "next/link";
import { useProgress } from "@/lib/progress";

export function ResumeCard({ lessons }: { lessons: { id: string; title: string; url: string }[] }) {
  const { lastVisited } = useProgress();
  const lesson = lessons.find((l) => l.id === lastVisited);
  if (!lesson) return null;
  return (
    <Link
      href={lesson.url}
      className="group flex items-center justify-between gap-4 rounded-md border border-border bg-surface px-5 py-4 transition-colors hover:border-muted"
    >
      <span>
        <span className="block text-xs font-medium uppercase tracking-wider text-muted">Lanjutkan dari terakhir dibuka</span>
        <span className="mt-1 block font-heading font-semibold">{lesson.title}</span>
      </span>
      <span className="text-accent transition-transform group-hover:translate-x-0.5" aria-hidden="true">→</span>
    </Link>
  );
}
