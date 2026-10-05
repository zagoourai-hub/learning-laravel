import Link from "next/link";
import { getAllLessons, getModules } from "@/lib/content";
import { CodeBlock } from "@/components/mdx/code-block";
import HeroSection from "@/components/ui/hero-section-with-gradient";
import { ResumeCard } from "@/components/learn/resume-card";

// Excerpt from the Modul 02 lesson (ProductController@store), kept verbatim.
const SNIPPET = `public function store(StoreProductRequest $request): RedirectResponse
{
    Product::create($request->validated());

    return to_route('products.index')
        ->with('success', 'Produk berhasil ditambahkan.');
}`;

// Concrete contents per module, from PRD section 12 (curriculum).
const PATH_CONTENTS: Record<string, string[]> = {
  "01-persiapan": [
    "Roadmap & apa itu Laravel",
    "Instalasi PHP, Composer, laravel new, composer run dev",
    "Struktur folder proyek",
    "Routing dasar & php artisan route:list",
  ],
  "02-crud-pemula": [
    "Migration & model ($fillable, casts)",
    "Resource controller + StoreProductRequest / UpdateProductRequest",
    "Blade + Tailwind, pagination, old() & @error",
    "Route model binding: dari mana $product berasal",
    "Konfirmasi hapus dengan SweetAlert2",
    "Tabel error yang sering muncul + solusinya",
  ],
  "03-service-pattern": [
    "Kenapa controller gemuk bermasalah",
    "Membuat ProductService",
    "Controller tipis dengan constructor DI",
    "Testing service, alternatif Action/DTO",
  ],
};

const FACTS = [
  ["Setiap file final bisa disalin utuh", "Bagian “Here's your complete …” berisi isi file lengkap dengan tombol Salin, bukan potongan yang harus kamu rakit sendiri."],
  ["Progres tersimpan di perangkatmu, tanpa akun", "Tandai pelajaran selesai dan lanjutkan dari halaman terakhir. Data hanya ada di localStorage browser."],
  ["Cari dengan Ctrl/⌘ K", "Ketik pesan error seperti “419 Page Expired” atau topik seperti “route model binding” untuk langsung ke bagian yang relevan."],
  ["Ditulis untuk Laravel 13.x", "Setiap pelajaran mencantumkan versi Laravel dan tanggal terakhir diverifikasi."],
] as const;

const FAQ = [
  ["Apakah gratis?", "Ya. Semua materi bisa dibaca tanpa daftar dan tanpa biaya."],
  [
    "Perlu menyiapkan apa?",
    "PHP 8.3 atau lebih baru, Composer, Node.js, editor kode, dan terminal. Laravel 13 memakai SQLite secara default, jadi kamu tidak perlu menginstal MySQL.",
  ],
  ["Versi Laravel yang dipakai?", "Laravel 13.x. Versi dan tanggal verifikasi tertulis di atas setiap pelajaran."],
  [
    "Saya dari NestJS/Express. Mulai dari mana?",
    "Baca cepat Modul 02 untuk mengenal konvensi Laravel, lalu lanjut ke Modul 03: Service Pattern adalah padanan pola controller + service yang sudah kamu kenal.",
  ],
] as const;

export default function Home() {
  const modules = getModules();
  const lessons = getAllLessons();
  const first = lessons[0];
  const pathModules = modules.filter((m) => m.id in PATH_CONTENTS);

  return (
    <>
      {/* Hero */}
      <HeroSection startHref={first?.url ?? "/belajar/"} pathHref="#jalur">
        <CodeBlock data-title="app/Http/Controllers/ProductController.php" data-language="php">
          <code>{SNIPPET}</code>
        </CodeBlock>
        <p className="mt-3 text-sm text-muted">
          Dari Modul 02: <code className="font-mono text-[0.85em]">$request-&gt;validated()</code> hanya berisi data yang
          lolos validasi <code className="font-mono text-[0.85em]">StoreProductRequest</code>.
        </p>
      </HeroSection>

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mt-10 max-w-xl empty:hidden">
          <ResumeCard lessons={lessons.map(({ id, title, url }) => ({ id, title, url }))} />
        </div>

        {/* Learning path */}
        <section id="jalur" aria-labelledby="jalur-title" className="scroll-mt-20 py-20">
          <h2 id="jalur-title" className="font-heading text-2xl sm:text-3xl">
            Jalur belajar
          </h2>
          <p className="mt-3 max-w-[60ch] text-muted">Tiga modul berurutan. Selesaikan satu sebelum lanjut ke berikutnya.</p>

          <ol className="mt-10 grid gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-3">
            {pathModules.map((m) => {
              const comingSoon = m.status === "coming-soon";
              return (
                <li key={m.id} className="flex flex-col bg-background p-6 sm:p-8">
                  <div className="flex items-baseline justify-between gap-4">
                    <span className="font-mono text-sm text-muted">{String(m.order).padStart(2, "0")}</span>
                    {comingSoon && <span className="text-xs font-medium text-muted">Segera hadir</span>}
                  </div>
                  <h3 className="mt-3 font-heading text-lg">
                    <Link href={`/belajar/${m.id}/`} className="hover:text-accent">
                      {m.title}
                    </Link>
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{m.description}</p>
                  <ul className="mt-5 space-y-2 border-t border-border pt-5 text-sm">
                    {PATH_CONTENTS[m.id].map((item) => (
                      <li key={item} className="flex gap-2">
                        <span className="text-muted" aria-hidden="true">–</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  {m.nextModule && (
                    <p className="mt-auto pt-6 text-xs text-muted">
                      Next step → Modul {m.nextModule.slice(0, 2)}
                    </p>
                  )}
                </li>
              );
            })}
          </ol>
        </section>

        {/* Facts */}
        <section aria-labelledby="fakta-title" className="border-t border-border py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <h2 id="fakta-title" className="font-heading text-2xl sm:text-3xl">
              Cara situs ini bekerja
            </h2>
            <dl className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
              {FACTS.map(([title, body]) => (
                <div key={title}>
                  <dt className="font-heading font-extrabold uppercase tracking-wide">{title}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted">{body}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-title" className="border-t border-border py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <h2 id="faq-title" className="font-heading text-2xl sm:text-3xl">
              Pertanyaan umum
            </h2>
            <div className="divide-y divide-border border-y border-border">
              {FAQ.map(([q, a]) => (
                <details key={q} className="group">
                  <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 font-heading font-semibold [&::-webkit-details-marker]:hidden">
                    {q}
                    <span className="text-muted transition-transform group-open:rotate-45" aria-hidden="true">+</span>
                  </summary>
                  <p className="max-w-[65ch] pb-5 leading-relaxed text-muted">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        {first && (
          <section className="flex flex-col items-start gap-6 border-t border-border py-20 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl">Siap membuat CRUD pertamamu?</h2>
              <p className="mt-2 text-muted">
                {first.title} · ± {first.estimatedMinutes} menit
              </p>
            </div>
            <Link
              href={first.url}
              className="inline-flex min-h-11 items-center rounded-md bg-accent px-5 text-sm font-semibold text-accent-foreground transition-opacity hover:opacity-90"
            >
              Mulai pelajaran
            </Link>
          </section>
        )}
      </div>
    </>
  );
}
