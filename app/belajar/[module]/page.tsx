import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getLessonsByModule, getModule, getModules } from "@/lib/content";
import { Breadcrumb } from "@/components/learn/breadcrumb";
import { ModuleProgress } from "@/components/learn/module-progress";
import { LessonList } from "@/components/learn/lesson-list";

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

  return (
    <div className="max-w-4xl">
      <Breadcrumb items={[{ label: "Belajar", href: "/belajar/" }, { label: `Modul ${number}` }]} />
      <p className="mt-6 font-mono text-sm text-muted">Modul {number}</p>
      <h1 className="mt-2 font-heading text-3xl sm:text-4xl">{m.title}</h1>
      <p className="mt-4 max-w-[65ch] font-body text-lg leading-relaxed text-muted">{m.description}</p>

      {m.status === "coming-soon" || lessons.length === 0 ? (
        <div className="mt-10 border-l-2 border-border bg-surface px-6 py-5">
          <h2 className="font-heading text-base">Segera hadir</h2>
          <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted">
            Materi modul ini sedang ditulis dan diuji di repo demo Laravel 13. Sementara itu, lanjutkan dari modul yang
            sudah terbit.
          </p>
          <Link href="/belajar/" className="mt-4 inline-flex min-h-10 items-center text-sm font-semibold text-accent hover:underline">
            ← Kembali ke jalur belajar
          </Link>
        </div>
      ) : (
        <>
          <div className="mt-6 max-w-sm">
            <ModuleProgress lessonIds={lessons.map((l) => l.id)} label={m.title} />
          </div>
          <LessonList
            lessons={lessons.map(({ id, title, url, order, estimatedMinutes }) => ({ id, title, url, order, estimatedMinutes }))}
          />
        </>
      )}
    </div>
  );
}
