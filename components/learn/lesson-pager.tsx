import Link from "next/link";
import type { Lesson } from "@/lib/types";

export function LessonPager({ prev, next }: { prev?: Lesson; next?: Lesson }) {
  if (!prev && !next) return null;
  return (
    <nav aria-label="Pelajaran sebelum dan sesudah" className="grid gap-4 sm:grid-cols-2" data-pagefind-ignore>
      {prev ? (
        <Link href={prev.url} className="rounded-md border border-border px-5 py-4 transition-colors hover:border-muted">
          <span className="block text-xs text-muted">← Sebelumnya</span>
          <span className="mt-1 block font-heading font-semibold">{prev.title}</span>
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link href={next.url} className="rounded-md border border-border px-5 py-4 text-right transition-colors hover:border-muted">
          <span className="block text-xs text-muted">Berikutnya →</span>
          <span className="mt-1 block font-heading font-semibold">{next.title}</span>
        </Link>
      )}
    </nav>
  );
}
