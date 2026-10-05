import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLessonsByModule, getModule, getModules } from "@/lib/content";
import { Breadcrumb } from "@/components/learn/breadcrumb";
import { GridBanner } from "@/components/learn/grid-banner";
import { LessonGrid } from "@/components/learn/lesson-grid";
import { ModuleProgress } from "@/components/learn/module-progress";

export const dynamicParams = false;

export function generateStaticParams() {
  return getModules().map((m) => ({ module: m.id }));
}

export async function generateMetadata({ params }: PageProps<"/belajar/[module]">): Promise<Metadata> {
  const m = getModule((await params).module);
  if (!m) return {};
  return { title: m.title, description: m.description, alternates: { canonical: `/belajar/${m.id}/` } };
}

export default async function ModulePage({ params }: PageProps<"/belajar/[module]">) {
  const m = getModule((await params).module);
  if (!m) notFound();
  const lessons = getLessonsByModule(m.id);
  const number = String(m.order).padStart(2, "0");
  const soon = m.status === "coming-soon" || lessons.length === 0;

  return (
    <div className="relative min-h-screen bg-background">
      <GridBanner />
      <div className="relative z-10 flex min-h-[250px] flex-col justify-center border-b border-border p-6">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-4">
          <Breadcrumb items={[{ label: "Belajar", href: "/belajar/" }, { label: `Modul ${number}` }]} />
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl md:text-5xl">{m.title}</h1>
            <p className="max-w-3xl font-body text-base text-muted md:text-lg">{m.description}</p>
          </div>
          {!soon && (
            <div className="max-w-sm">
              <ModuleProgress lessonIds={lessons.map((l) => l.id)} label={m.title} />
            </div>
          )}
        </div>
      </div>

      {soon ? (
        <div className="mx-auto w-full max-w-7xl px-6 lg:px-0">
          <div className="border-x border-b border-border p-6 lg:p-10">
            <h2 className="text-base">Segera hadir</h2>
            <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted">
              Materi modul ini sedang ditulis dan diuji di repo demo Laravel 13. Sementara itu, lanjutkan dari modul yang
              sudah terbit.
            </p>
            <Link href="/belajar/" className="mt-4 inline-flex min-h-10 items-center text-sm font-semibold text-accent hover:underline">
              ← Kembali ke jalur belajar
            </Link>
          </div>
        </div>
      ) : (
        <LessonGrid
          lessons={lessons.map((l) => ({
            id: l.id,
            title: l.title,
            description: l.description,
            url: l.url,
            moduleTitle: m.title,
            level: l.level,
            estimatedMinutes: l.estimatedMinutes,
          }))}
        />
      )}
    </div>
  );
}
