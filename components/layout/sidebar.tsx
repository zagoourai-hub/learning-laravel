"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useProgress } from "@/lib/progress";

export type SidebarModule = {
  id: string;
  title: string;
  order: number;
  comingSoon: boolean;
  lessons: { id: string; title: string; url: string }[];
};

function Nav({ modules }: { modules: SidebarModule[] }) {
  const pathname = usePathname();
  const { completed } = useProgress();
  const isActive = (url: string) => pathname === url || pathname === url.replace(/\/$/, "");

  return (
    <nav aria-label="Daftar modul dan pelajaran" className="text-sm">
      <Link
        href="/belajar/"
        aria-current={isActive("/belajar/") ? "page" : undefined}
        className="mb-4 flex min-h-10 items-center rounded-md px-3 font-heading font-semibold text-foreground hover:bg-surface-2 aria-[current=page]:text-accent"
      >
        Semua modul
      </Link>
      <ol className="space-y-5">
        {modules.map((m) => {
          const moduleUrl = `/belajar/${m.id}/`;
          return (
            <li key={m.id} className={m.comingSoon ? "opacity-60" : undefined}>
              <Link
                href={moduleUrl}
                aria-current={isActive(moduleUrl) ? "page" : undefined}
                className="flex min-h-10 items-baseline gap-2 rounded-md px-3 py-2 font-heading font-semibold hover:bg-surface-2 aria-[current=page]:text-accent"
              >
                <span className="font-mono text-xs text-muted">{String(m.order).padStart(2, "0")}</span>
                <span className="flex-1">{m.title}</span>
              </Link>
              {m.comingSoon ? (
                <p className="px-3 pl-10 text-xs text-muted">Segera hadir</p>
              ) : (
                <ol className="mt-1 ml-[1.15rem] border-l border-border">
                  {m.lessons.map((l) => {
                    const active = isActive(l.url);
                    const done = Boolean(completed[l.id]);
                    return (
                      <li key={l.id}>
                        <Link
                          href={l.url}
                          aria-current={active ? "page" : undefined}
                          className="-ml-px flex min-h-10 items-center gap-2 border-l border-transparent py-2 pr-2 pl-4 text-muted hover:text-foreground aria-[current=page]:border-accent aria-[current=page]:font-medium aria-[current=page]:text-foreground"
                        >
                          <span className="flex-1">{l.title}</span>
                          {done && (
                            <svg className="size-4 shrink-0 text-success" viewBox="0 0 20 20" fill="currentColor" aria-label="Selesai" role="img">
                              <path fillRule="evenodd" d="M16.7 5.3a1 1 0 0 1 0 1.4l-8 8a1 1 0 0 1-1.4 0l-4-4a1 1 0 1 1 1.4-1.4L8 12.6l7.3-7.3a1 1 0 0 1 1.4 0Z" clipRule="evenodd" />
                            </svg>
                          )}
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function Sidebar({ modules }: { modules: SidebarModule[] }) {
  return (
    <>
      <details className="mb-6 rounded-md border border-border bg-surface lg:hidden">
        <summary className="flex min-h-11 cursor-pointer items-center px-4 font-heading text-sm font-semibold">
          Menu pelajaran
        </summary>
        <div className="border-t border-border p-2">
          <Nav modules={modules} />
        </div>
      </details>
      <aside className="sticky top-20 hidden max-h-[calc(100vh-6rem)] overflow-y-auto pb-8 lg:block" data-pagefind-ignore>
        <Nav modules={modules} />
      </aside>
    </>
  );
}
