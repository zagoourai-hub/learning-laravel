import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAdjacentLessons, getAllLessonParams, getLesson, getLessonsByModule, getModule } from "@/lib/content";
import { compileLesson } from "@/lib/mdx";
import { SITE_NAME, SITE_URL } from "@/lib/site";
import { mdxComponents } from "@/components/mdx";
import { Breadcrumb } from "@/components/learn/breadcrumb";
import { LessonHeader } from "@/components/learn/lesson-header";
import { Toc, TocMobile } from "@/components/learn/toc";
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

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_14rem] xl:gap-10">
      <div className="min-w-0">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <VisitTracker id={lesson.id} />
        <Breadcrumb
          items={[
            { label: "Belajar", href: "/belajar/" },
            { label: `Modul ${String(mod.order).padStart(2, "0")}`, href: `/belajar/${mod.id}/` },
            { label: lesson.title },
          ]}
        />
        <div className="mt-6">
          <LessonHeader lesson={lesson} />
        </div>
        <TocMobile toc={toc} />

        <article className="prose mt-10" data-pagefind-body>
          <Content components={mdxComponents} />
        </article>
        <p className="mt-12 max-w-[72ch] border-t border-border pt-4 font-sans text-sm text-muted">
          Web tutorial ini dibuat oleh zagoours
        </p>

        <div className="mt-14 max-w-[72ch] space-y-10 border-t border-border pt-10">
          <CompleteButton id={lesson.id} />
          {nextModule && <NextStepCard module={nextModule} />}
          <LessonPager prev={prev} next={next} />
          <section aria-labelledby="diskusi">
            <h2 id="diskusi" className="mb-4 font-heading text-xl">
              Diskusi
            </h2>
            <Comments key={lesson.id} />
          </section>
        </div>
      </div>

      <div className="hidden xl:block">
        <Toc toc={toc} />
      </div>
    </div>
  );
}
