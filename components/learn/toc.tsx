import type { TocItem } from "@/lib/types";

function TocList({ toc }: { toc: TocItem[] }) {
  return (
    <ol className="space-y-1 text-sm">
      {toc.map((item) => (
        <li key={item.id} className={item.depth === 3 ? "pl-4" : undefined}>
          <a href={`#${item.id}`} className="block py-1 leading-snug text-muted hover:text-foreground">
            {item.text}
          </a>
        </li>
      ))}
    </ol>
  );
}

export function Toc({ toc }: { toc: TocItem[] }) {
  if (toc.length === 0) return null;
  return (
    <nav aria-label="Daftar isi" data-pagefind-ignore>
      <h2 className="mb-3 text-sm">Di halaman ini</h2>
      <TocList toc={toc} />
    </nav>
  );
}

export function TocMobile({ toc }: { toc: TocItem[] }) {
  if (toc.length === 0) return null;
  return (
    <details className="my-8 rounded-md border border-border-strong bg-surface lg:hidden" data-pagefind-ignore>
      <summary className="flex min-h-11 cursor-pointer items-center px-4 font-heading text-sm font-semibold">Daftar isi</summary>
      <div className="border-t border-border px-4 py-3">
        <TocList toc={toc} />
      </div>
    </details>
  );
}
