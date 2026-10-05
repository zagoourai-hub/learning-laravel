import Link from "next/link";
import { OpenSearchButton } from "@/components/learn/open-search-button";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:py-28">
      <p className="font-mono text-sm text-muted">404</p>
      <h1 className="mt-3 font-heading text-3xl sm:text-4xl">Halaman tidak ditemukan</h1>
      <p className="mt-4 max-w-[60ch] font-body text-lg leading-relaxed text-muted">
        Alamat ini tidak ada atau pelajarannya sudah dipindah. Tekan{" "}
        <kbd className="rounded border border-border px-1.5 font-mono text-sm">Ctrl</kbd> /{" "}
        <kbd className="rounded border border-border px-1.5 font-mono text-sm">⌘</kbd> +{" "}
        <kbd className="rounded border border-border px-1.5 font-mono text-sm">K</kbd> untuk mencari materi.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/belajar/"
          className="inline-flex min-h-11 items-center rounded-md bg-accent px-5 text-sm font-semibold text-accent-foreground hover:opacity-90"
        >
          Ke jalur belajar
        </Link>
        <OpenSearchButton />
        <Link href="/" className="inline-flex min-h-11 items-center rounded-md border border-border px-5 text-sm font-semibold hover:border-muted">
          Beranda
        </Link>
      </div>
    </div>
  );
}
