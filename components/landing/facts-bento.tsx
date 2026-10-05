import { BentoCard, BentoGrid } from "@/components/magicui/bento-grid";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ModuleProgress } from "@/components/learn/module-progress";
import { OpenSearchButton } from "@/components/learn/open-search-button";

const kbd = "inline-flex h-9 min-w-9 items-center justify-center rounded-md border border-border-strong bg-background px-2 font-mono text-sm";

// "How the site works" as a bento: each cell has a small real visual.
export function FactsBento({ lessonIds, verified }: { lessonIds: string[]; verified: string }) {
  return (
    <BlurFade>
      <BentoGrid>
        <BentoCard
          className="md:col-span-2"
          title="Setiap file final bisa disalin utuh"
          description="Bagian “Here's your complete …” berisi isi file lengkap dengan tombol Salin, bukan potongan yang harus kamu rakit sendiri."
          visual={
            <div aria-hidden="true" className="w-full max-w-md overflow-hidden rounded-md border border-white/10 bg-[#0d1117] text-[#e6edf3]">
              <div className="flex items-center justify-between border-b border-white/10 px-3 py-1.5 font-mono text-[11px] text-[#9da7b3]">
                <span className="truncate">app/Http/Controllers/ProductController.php</span>
                <span className="ml-3 shrink-0">Salin</span>
              </div>
              <pre className="overflow-hidden px-3 py-3 font-mono text-[11px] leading-5 sm:text-xs">
                {"Product::create($request->validated());\n\nreturn to_route('products.index')\n    ->with('success', ...);"}
              </pre>
            </div>
          }
        />
        <BentoCard
          title="Progres tersimpan di perangkatmu, tanpa akun"
          description="Tandai pelajaran selesai dan lanjutkan dari halaman terakhir. Data hanya ada di localStorage browser."
          visual={
            <div className="w-full max-w-xs">
              <p className="mb-2 text-xs text-muted">Progresmu di perangkat ini</p>
              <ModuleProgress lessonIds={lessonIds} label="semua pelajaran" />
            </div>
          }
        />
        <BentoCard
          title="Cari dengan Ctrl/⌘ K"
          description="Ketik pesan error seperti “419 Page Expired” atau topik seperti “route model binding” untuk langsung ke bagian yang relevan."
          visual={
            <div aria-hidden="true" className="flex items-center gap-2">
              <kbd className={kbd}>Ctrl</kbd>
              <span className="text-muted">+</span>
              <kbd className={kbd}>K</kbd>
            </div>
          }
          action={<OpenSearchButton />}
        />
        <BentoCard
          className="md:col-span-2"
          title="Ditulis untuk Laravel 13.x"
          description="Setiap pelajaran mencantumkan versi Laravel dan tanggal terakhir diverifikasi."
          visual={
            <ul className="flex flex-wrap justify-center gap-2 text-sm">
              {["Laravel 13.x", "PHP 8.3+", `${lessonIds.length} pelajaran`, `Diverifikasi ${verified}`].map((c) => (
                <li key={c} className="rounded-md border border-border bg-background px-3 py-1.5">
                  {c}
                </li>
              ))}
            </ul>
          }
        />
      </BentoGrid>
    </BlurFade>
  );
}
