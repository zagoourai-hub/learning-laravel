import Link from "next/link";
import type { Lesson } from "@/lib/types";
import { GridBanner } from "./grid-banner";

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );

const chip = "flex h-6 w-fit items-center justify-center rounded-md border border-border bg-surface px-3 text-sm";

export function LessonHeader({ lesson }: { lesson: Lesson }) {
  return (
    <div className="relative z-10 border-b border-border">
      <GridBanner />
      <div className="relative z-10 mx-auto flex max-w-7xl flex-col gap-6 p-6">
        <div className="flex flex-wrap items-center gap-3 gap-y-4 text-sm text-muted">
          <Link
            href="/belajar/"
            aria-label="Kembali ke jalur belajar"
            className="flex size-10 items-center justify-center rounded-md border border-border bg-background text-foreground hover:bg-surface-2 sm:size-8"
          >
            <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </Link>
          {lesson.tags.map((tag) => (
            <span key={tag} className={chip}>
              {tag}
            </span>
          ))}
          <time dateTime={lesson.lastVerified} className="font-medium">
            Diverifikasi {formatDate(lesson.lastVerified)}
          </time>
        </div>

        <h1 className="text-balance text-4xl md:text-5xl lg:text-6xl">{lesson.title}</h1>
        <p className="max-w-4xl font-body text-muted md:text-lg">{lesson.description}</p>

        <ul className="flex flex-wrap gap-3 text-muted">
          <li className={chip}>{lesson.level === "pemula" ? "Pemula" : "Menengah"}</li>
          <li className={chip}>± {lesson.estimatedMinutes} menit</li>
          <li className={chip}>Laravel {lesson.laravelVersion}</li>
        </ul>
      </div>
    </div>
  );
}
