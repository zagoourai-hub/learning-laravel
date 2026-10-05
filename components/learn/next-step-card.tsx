import Link from "next/link";
import type { ModuleMeta } from "@/lib/types";

export function NextStepCard({ module }: { module: ModuleMeta }) {
  return (
    <aside aria-label="Langkah berikutnya" className="border-l-2 border-accent bg-surface px-6 py-5" data-pagefind-ignore>
      <p className="text-xs font-semibold uppercase tracking-wider text-accent">Next step · Modul {String(module.order).padStart(2, "0")}</p>
      <h2 className="mt-2 font-heading text-xl">{module.title}</h2>
      <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted">{module.description}</p>
      <Link
        href={`/belajar/${module.id}/`}
        className="mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-accent hover:underline"
      >
        {module.status === "coming-soon" ? "Lihat modul (segera hadir)" : "Lanjut ke modul ini"} <span aria-hidden="true">→</span>
      </Link>
    </aside>
  );
}
