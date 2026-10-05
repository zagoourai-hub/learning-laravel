import type { Metadata } from "next";
import { getAllLessons, getLessonsByModule, getModules } from "@/lib/content";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { ModuleFilter } from "@/components/learn/module-filter";
import { ResumeCard } from "@/components/learn/resume-card";
import type { GridModule } from "@/components/learn/lesson-grid";

export const metadata: Metadata = {
  title: "Jalur Belajar",
  description: "Semua modul tutorial Laravel 13: persiapan, CRUD pemula full controller, Service Pattern, dan seterusnya.",
  alternates: { canonical: "/belajar/" },
};

export default function BelajarPage() {
  const modules: GridModule[] = getModules().map((m) => ({
    id: m.id,
    title: m.title,
    order: m.order,
    comingSoon: m.status === "coming-soon",
    lessons: getLessonsByModule(m.id).map((l) => ({
      id: l.id,
      title: l.title,
      description: l.description,
      url: l.url,
      moduleTitle: m.title,
      level: l.level,
      estimatedMinutes: l.estimatedMinutes,
    })),
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    name: "Laravel 13 untuk Pemula",
    description: metadata.description,
    inLanguage: "id",
    provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <ModuleFilter
      modules={modules}
      resume={<ResumeCard lessons={getAllLessons().map(({ id, title, url }) => ({ id, title, url }))} />}
      header={
        <div className="flex flex-col gap-2">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
          <h1 className="text-4xl md:text-5xl">Jalur Belajar</h1>
          <p className="max-w-3xl font-body text-base text-muted md:text-lg">
            Ikuti modul secara berurutan, dari persiapan sampai CRUD dan Service Pattern. Pilih modul di bawah untuk
            menyaring pelajaran.
          </p>
        </div>
      }
    />
  );
}
