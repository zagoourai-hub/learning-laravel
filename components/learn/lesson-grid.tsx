import { ComingSoonCard, LessonCard, type CardLesson } from "./lesson-card";

export type GridModule = { id: string; title: string; order: number; comingSoon: boolean; lessons: CardLesson[] };

// Hairline card grid shared by /belajar, the module page and "Baca juga".
export function LessonGrid({ lessons, soon = [], framed = true }: { lessons: CardLesson[]; soon?: GridModule[]; framed?: boolean }) {
  const count = lessons.length + soon.length;
  return (
    <div className={framed ? "mx-auto w-full max-w-7xl px-6 lg:px-0" : "w-full"}>
      <div
        className={`relative grid grid-cols-1 overflow-hidden ${framed ? "border-x" : ""} border-border md:grid-cols-2 lg:grid-cols-3 ${
          count < 4 ? "border-b" : "border-b-0"
        }`}
      >
        {lessons.map((l) => (
          <LessonCard key={l.id} lesson={l} showRightBorder={count < 3} />
        ))}
        {soon.map((m) => (
          <ComingSoonCard key={m.id} title={m.title} order={m.order} showRightBorder={count < 3} />
        ))}
      </div>
    </div>
  );
}
