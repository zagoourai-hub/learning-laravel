import { getModule } from "@/lib/content";
import type { Lesson } from "@/lib/types";
import { LessonGrid } from "./lesson-grid";

// Other lessons of the same module, not already shown by the pager: same-tag ones first, then the rest.
export function ReadMore({ lesson, prev, next, siblings }: { lesson: Lesson; prev?: Lesson; next?: Lesson; siblings: Lesson[] }) {
  const picked = new Set([lesson.id, prev?.id, next?.id]);
  const items = siblings
    .filter((l) => !picked.has(l.id))
    .map((l) => ({ l, overlap: l.tags.filter((t) => lesson.tags.includes(t)).length }))
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, 3)
    .map((x) => x.l);
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
