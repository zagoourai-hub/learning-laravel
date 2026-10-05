import Link from "next/link";
import { SITE_NAME } from "@/lib/site";
import { SearchDialog } from "@/components/learn/search-dialog";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header
      className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70"
      data-pagefind-ignore
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5 rounded-lg font-heading text-[1.05rem] font-bold tracking-tight">
          <span className="grid size-8 place-items-center rounded-lg bg-accent text-sm font-extrabold text-accent-foreground" aria-hidden="true">
            L
          </span>
          <span className="hidden sm:inline">{SITE_NAME}</span>
        </Link>

        <nav aria-label="Navigasi utama" className="ml-2 flex items-center gap-1 text-sm font-medium">
          <Link href="/belajar/" className="rounded-lg px-3 py-2.5 text-muted transition-colors hover:bg-surface-2 hover:text-foreground">
            Belajar
          </Link>
          <Link href="/tentang/" className="rounded-lg px-3 py-2.5 text-muted transition-colors hover:bg-surface-2 hover:text-foreground">
            Tentang
          </Link>
        </nav>

        <div className="ml-auto flex items-center gap-1.5">
          <SearchDialog />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
