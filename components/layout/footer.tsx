import Link from "next/link";
import { SITE_NAME } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-surface" data-pagefind-ignore>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 text-sm text-muted md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-heading font-semibold text-foreground">{SITE_NAME}</p>
          <p className="mt-1">Tutorial Laravel 13 berbahasa Indonesia. Gratis, tanpa akun.</p>
        </div>
        <nav aria-label="Tautan footer" className="flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/belajar/" className="py-2 hover:text-foreground">Jalur Belajar</Link>
          <Link href="/tentang/" className="py-2 hover:text-foreground">Tentang & Kontribusi</Link>
          <Link href="/tentang/#lisensi" className="py-2 hover:text-foreground">Lisensi</Link>
        </nav>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-6 py-4 font-sans text-sm text-muted">
          Web tutorial ini dibuat oleh zagoours
        </p>
      </div>
    </footer>
  );
}
