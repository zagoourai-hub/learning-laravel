import type { Lesson } from "@/lib/types";

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );

export function LessonHeader({ lesson }: { lesson: Lesson }) {
  const meta = [
    lesson.level === "pemula" ? "Pemula" : "Menengah",
    `± ${lesson.estimatedMinutes} menit`,
    `Laravel ${lesson.laravelVersion}`,
  ];
  return (
    <header className="max-w-[72ch]">
      <h1 className="font-heading text-2xl text-balance sm:text-3xl">{lesson.title}</h1>
      <p className="mt-4 font-body text-lg leading-relaxed text-muted">{lesson.description}</p>
      <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 border-y border-border py-3 text-sm text-muted">
        {meta.map((m) => (
          <li key={m}>{m}</li>
        ))}
        <li>
          Terakhir diverifikasi <time dateTime={lesson.lastVerified}>{formatDate(lesson.lastVerified)}</time>
        </li>
      </ul>
    </header>
  );
}
