import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdjacentLessons, getAllLessonParams, getLesson, getLessonsByModule, getModule } from "@/lib/content";
import { compileLesson } from "@/lib/mdx";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { mdxComponents } from "@/components/mdx";
import { LessonHeader } from "@/components/learn/lesson-header";
import { TocMobile } from "@/components/learn/toc";
import { LessonAside } from "@/components/learn/lesson-aside";
import { ModuleLessons } from "@/components/learn/module-lessons";
import { ReadMore } from "@/components/learn/read-more";
import { CompleteButton } from "@/components/learn/complete-button";
import { LessonPager } from "@/components/learn/lesson-pager";
import { NextStepCard } from "@/components/learn/next-step-card";
import { VisitTracker } from "@/components/learn/visit-tracker";
import { Comments } from "@/components/learn/comments";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllLessonParams();
}

export async function generateMetadata({ params }: PageProps<"/belajar/[module]/[slug]">): Promise<Metadata> {
  const { module, slug } = await params;
  const lesson = getLesson(module, slug);
  if (!lesson) return {};
  return {
    title: lesson.title,
    description: lesson.description,
    keywords: lesson.tags,
    alternates: { canonical: lesson.url },
    openGraph: { type: "article", title: lesson.title, description: lesson.description, url: lesson.url },
  };
}

export default async function LessonPage({ params }: PageProps<"/belajar/[module]/[slug]">) {
  const { module: moduleId, slug } = await params;
  const lesson = getLesson(moduleId, slug);
  const mod = getModule(moduleId);
  if (!lesson || !mod) notFound();

  const { Content, toc } = await compileLesson(lesson);
  const { prev, next } = getAdjacentLessons(moduleId, slug);
  const moduleLessons = getLessonsByModule(moduleId);
  const isLastInModule = moduleLessons.at(-1)?.id === lesson.id;
  const nextModule = isLastInModule && mod.nextModule ? getModule(mod.nextModule) : undefined;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: lesson.title,
    description: lesson.description,
    inLanguage: "id",
    dateModified: lesson.lastVerified,
    keywords: lesson.tags.join(", "),
    url: new URL(lesson.url, SITE_URL).toString(),
    publisher: { "@type": "Organization", name: SITE_NAME },
  };

  const moduleList = moduleLessons.map(({ id, title, url }) => ({ id, title, url }));

  return (
    <div className="relative min-h-screen bg-background">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <VisitTracker id={lesson.id} />
      <LessonHeader lesson={lesson} />

      <div className="relative z-10 mx-auto max-w-7xl px-4 md:px-0">
        <div className="flex divide-x divide-border border-x border-border">
          <main className="min-w-0 flex-1">
            <div className="p-6 lg:p-10">
              <div className="space-y-4 lg:hidden" data-pagefind-ignore>
                <TocMobile toc={toc} />
                <details className="rounded-md border border-border bg-surface">
                  <summary className="flex min-h-11 cursor-pointer items-center px-4 font-heading text-sm font-semibold">
                    Pelajaran di modul ini
                  </summary>
                  <div className="border-t border-border p-2">
                    <ModuleLessons lessons={moduleList} currentId={lesson.id} />
                  </div>
                </details>
              </div>

              <article className="prose mt-8 lg:mt-0" data-pagefind-body>
                <Content components={mdxComponents} />
              </article>
              <p className="mt-12 max-w-[72ch] border-t border-border pt-4 font-sans text-sm text-muted">
                Web tutorial ini dibuat oleh zagoours
              </p>

              <div className="mt-10 max-w-[72ch] space-y-10">
                <CompleteButton id={lesson.id} />
                <LessonPager prev={prev} next={next} />
                {nextModule && <NextStepCard module={nextModule} />}
                <section aria-labelledby="diskusi">
                  <h2 id="diskusi" className="mb-4 text-xl">
                    Diskusi
                  </h2>
                  <Comments key={lesson.id} />
                </section>
              </div>
            </div>
            <ReadMore lesson={lesson} prev={prev} next={next} siblings={moduleLessons} />
          </main>

          <LessonAside lesson={lesson} module={mod} moduleLessons={moduleList} toc={toc} />
        </div>
      </div>
    </div>
  );
}
