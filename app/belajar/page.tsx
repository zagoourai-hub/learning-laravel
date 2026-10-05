import type { Metadata } from "next";
import Link from "next/link";
import { getAllLessons, getLessonsByModule, getModules } from "@/lib/content";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { ModuleProgress } from "@/components/learn/module-progress";
import { ResumeCard } from "@/components/learn/resume-card";

export const metadata: Metadata = {
  title: "Jalur Belajar",
  description: "Semua modul tutorial Laravel 13: persiapan, CRUD pemula full controller, dan Service Pattern.",
  alternates: { canonical: "/belajar/" },
};

export default function BelajarPage() {
  const modules = getModules();
  const lessons = getAllLessons();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Laravel 13 untuk Pemula",
    description: metadata.description,
    inLanguage: "id",
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <div className="max-w-4xl">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="font-heading text-3xl sm:text-4xl">Jalur belajar</h1>
      <p className="mt-4 max-w-[65ch] font-body text-lg leading-relaxed text-muted">
        Ikuti modul secara berurutan. Modul 02 membangun CRUD Product dengan semua logic di controller; Modul 03
        merefaktornya ke Service Pattern.
      </p>

      <div className="mt-8 max-w-xl empty:hidden">
        <ResumeCard lessons={lessons.map(({ id, title, url }) => ({ id, title, url }))} />
      </div>

      <ol className="mt-10 divide-y divide-border border-y border-border">
        {modules.map((m) => {
          const moduleLessons = getLessonsByModule(m.id);
          const comingSoon = m.status === "coming-soon";
          return (
            <li key={m.id} className="grid gap-2 py-6 sm:grid-cols-[3rem_minmax(0,1fr)]">
              <span className="font-mono text-sm text-muted sm:pt-1">{String(m.order).padStart(2, "0")}</span>
              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h2 className="font-heading text-lg">
                    <Link href={`/belajar/${m.id}/`} className={comingSoon ? "text-muted hover:text-foreground" : "hover:text-accent"}>
                      {m.title}
                    </Link>
                  </h2>
                  <span className="text-xs text-muted">
                    {m.level === "pemula" ? "Pemula" : "Menengah"}
                    {comingSoon ? " · Segera hadir" : ` · ${moduleLessons.length} pelajaran`}
                  </span>
                </div>
                <p className="mt-2 max-w-[65ch] text-sm leading-relaxed text-muted">{m.description}</p>
                {!comingSoon && (
                  <div className="mt-4 max-w-sm">
                    <ModuleProgress lessonIds={moduleLessons.map((l) => l.id)} label={m.title} />
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
