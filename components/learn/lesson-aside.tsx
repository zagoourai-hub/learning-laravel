import Link from "next/link";
import type { Lesson, ModuleMeta, TocItem } from "@/lib/types";
import { formatDate } from "./lesson-header";
import { ModuleLessons } from "./module-lessons";
import { Toc } from "./toc";

const card = "rounded-lg border border-border bg-surface p-6";

export function LessonAside({
  lesson,
  module,
  moduleLessons,
  toc,
}: {
  lesson: Lesson;
  module: ModuleMeta;
  moduleLessons: { id: string; title: string; url: string }[];
  toc: TocItem[];
}) {
  const rows: [string, string][] = [
    ["Level", lesson.level === "pemula" ? "Pemula" : "Menengah"],
    ["Durasi", `± ${lesson.estimatedMinutes} menit`],
    ["Versi Laravel", lesson.laravelVersion],
    ["Terakhir diverifikasi", formatDate(lesson.lastVerified)],
  ];
  return (
    <aside className="hidden w-[350px] shrink-0 bg-surface-2/60 p-6 lg:block lg:p-10" data-pagefind-ignore>
      <div className="sticky top-20 max-h-[calc(100vh-6rem)] space-y-8 overflow-y-auto">
        <section className={card}>
          <h2 className="mb-4 text-sm">Tentang pelajaran</h2>
          <dl className="space-y-3 text-sm">
            {rows.map(([k, v]) => (
              <div key={k}>
                <dt className="text-muted">{k}</dt>
                <dd className="font-medium">{v}</dd>
              </div>
            ))}
          </dl>
          <Link href={`/belajar/${module.id}/`} className="mt-4 inline-flex min-h-10 items-center text-sm font-semibold text-accent hover:underline">
            Modul: {module.title} →
          </Link>
        </section>

        {toc.length > 0 && (
          <div className={card}>
            <Toc toc={toc} />
          </div>
        )}

        <section className={card} aria-labelledby="modul-pelajaran">
          <h2 id="modul-pelajaran" className="mb-3 text-sm">
            Pelajaran di modul ini
          </h2>
          <ModuleLessons lessons={moduleLessons} currentId={lesson.id} />
        </section>
      </div>
    </aside>
  );
}
