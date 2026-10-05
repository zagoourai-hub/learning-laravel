"use client";

import Link from "next/link";
import { BlurFade } from "@/components/magicui/blur-fade";
import { BorderBeam } from "@/components/magicui/border-beam";
import { MagicCard } from "@/components/magicui/magic-card";

export type PathModule = {
  id: string;
  order: number;
  title: string;
  description: string;
  comingSoon: boolean;
  featured: boolean;
  lessonCount: number;
  minutes: number;
  level: string;
  nextOrder?: string;
  items: string[];
};

// Learning path: one card per module with real lesson counts. Spotlight and beam exist only in dark mode.
export function PathCards({ modules }: { modules: PathModule[] }) {
  return (
    <ol className="mt-10 grid gap-4 lg:grid-cols-3">
      {modules.map((m, i) => (
        <li key={m.id} className="flex">
          <BlurFade delay={i * 0.08} className="flex w-full">
            <MagicCard className={`flex w-full flex-col ${m.comingSoon ? "opacity-75" : ""}`}>
              {m.featured && <BorderBeam />}
              <div className="flex flex-1 flex-col p-6 sm:p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <span className="font-mono text-sm text-muted">{String(m.order).padStart(2, "0")}</span>
                  {m.comingSoon ? (
                    <span className="text-xs font-medium text-muted">Segera hadir</span>
                  ) : (
                    m.featured && <span className="text-xs font-semibold text-accent">Inti tutorial</span>
                  )}
                </div>
                <h3 className="mt-3 font-heading text-lg">
                  <Link href={`/belajar/${m.id}/`} className="-my-2 inline-flex items-center py-2 hover:text-accent">
                    {m.title}
                  </Link>
                </h3>
                <p className="mt-1 text-xs text-muted">
                  {m.lessonCount} pelajaran · ± {m.minutes} menit · {m.level}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted">{m.description}</p>
                <ul className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
                  {m.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="text-muted" aria-hidden="true">
                        –
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto flex items-center justify-between gap-4 pt-6">
                  <Link
                    href={`/belajar/${m.id}/`}
                    className="inline-flex min-h-10 items-center text-sm font-semibold text-accent hover:underline"
                  >
                    {m.comingSoon ? "Lihat modul" : "Mulai modul"} →
                  </Link>
                  {m.nextOrder && <span className="text-xs text-muted">Next step → Modul {m.nextOrder}</span>}
                </div>
              </div>
            </MagicCard>
          </BlurFade>
        </li>
      ))}
    </ol>
  );
}
