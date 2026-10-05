import { getModule } from "@/lib/content";
import type { Lesson } from "@/lib/types";
import { LessonGrid } from "./lesson-grid";

// Previous and next lessons, then other lessons of the same module that share tags.
export function ReadMore({ lesson, prev, next, siblings }: { lesson: Lesson; prev?: Lesson; next?: Lesson; siblings: Lesson[] }) {
  const picked = new Set([lesson.id, prev?.id, next?.id]);
  const related = siblings
    .filter((l) => !picked.has(l.id))
    .map((l) => ({ l, overlap: l.tags.filter((t) => lesson.tags.includes(t)).length }))
    .filter((x) => x.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3)
    .map((x) => x.l);

  const items = [prev, next, ...related].filter((l): l is Lesson => Boolean(l));
  if (items.length === 0) return null;

  return (
    <section aria-labelledby="baca-juga" className="border-t border-border" data-pagefind-ignore>
      <h2 id="baca-juga" className="p-6 pb-4 text-2xl lg:px-10">
        Baca juga
      </h2>
      <LessonGrid
        framed={false}
          lessons={items.map((l) => ({
            id: l.id,
            title: l.title,
            description: l.description,
            url: l.url,
            moduleTitle: getModule(l.module)?.title ?? l.module,
            level: l.level,
            estimatedMinutes: l.estimatedMinutes,
          }))}
      />
    </section>
  );
}
