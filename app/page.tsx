import Link from "next/link";
import { getAllLessons, getLessonsByModule, getModules } from "@/lib/content";
import { AnimatedSpan, Terminal, TypingAnimation } from "@/components/ui/terminal";
import HeroSection from "@/components/ui/hero-section-with-gradient";
import { ResumeCard } from "@/components/learn/resume-card";
import { formatDate } from "@/components/learn/lesson-header";
import { BlurFade } from "@/components/magicui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { FactsBento } from "@/components/landing/facts-bento";
import { FaqList } from "@/components/landing/faq-list";
import { PathCards, type PathModule } from "@/components/landing/path-cards";
import { SectionHeading } from "@/components/landing/section-heading";
import { StatsStrip } from "@/components/landing/stats-strip";
import { TopicsMarquee } from "@/components/landing/topics-marquee";

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
  const pathModules: PathModule[] = modules
    .filter((m) => m.id in PATH_CONTENTS)
    .map((m) => {
      const ls = getLessonsByModule(m.id);
      return {
        id: m.id,
        order: m.order,
        title: m.title,
        description: m.description,
        comingSoon: m.status === "coming-soon",
        featured: m.id === "02-crud-pemula",
        lessonCount: ls.length,
        minutes: ls.reduce((n, l) => n + l.estimatedMinutes, 0),
        level: m.level === "pemula" ? "Pemula" : "Menengah",
        nextOrder: m.nextModule?.slice(0, 2),
        items: PATH_CONTENTS[m.id],
      };
    });
  const published = modules.filter((m) => m.status === "published").length;
  const totalMinutes = lessons.reduce((n, l) => n + l.estimatedMinutes, 0);
  const verified = formatDate([...lessons].map((l) => l.lastVerified).sort().at(-1) ?? "2026-10-05");
  const topics = lessons.map((l) => ({ title: l.title, url: l.url }));

  return (
    <>
      {/* Hero */}
      <HeroSection startHref={first?.url ?? "/belajar/"} pathHref="#jalur">
        <Terminal className="!max-w-3xl !max-h-none">
          <TypingAnimation>php artisan make:model Product -mc --resource</TypingAnimation>
          <AnimatedSpan>   INFO  Model [app/Models/Product.php] created successfully.</AnimatedSpan>
          <AnimatedSpan>   INFO  Migration [database/migrations/..._create_products_table.php] created successfully.</AnimatedSpan>
          <AnimatedSpan>   INFO  Controller [app/Http/Controllers/ProductController.php] created successfully.</AnimatedSpan>
          <TypingAnimation>php artisan serve</TypingAnimation>
          <AnimatedSpan>   INFO  Server running on [http://127.0.0.1:8000].</AnimatedSpan>
        </Terminal>
        <p className="mt-3 text-sm text-muted">
          Dari Modul 02: satu perintah membuat model, migration, dan resource controller sekaligus.
        </p>
      </HeroSection>

      <div className="mx-auto max-w-7xl px-6">
        <div className="pt-10">
          <StatsStrip
            stats={[
              { label: "modul", value: published },
              { label: "pelajaran", value: lessons.length },
              { label: "jam materi (estimasi)", value: Math.round(totalMinutes / 60) },
            ]}
          />
        </div>

        <div className="mt-8 max-w-xl empty:hidden">
          <ResumeCard lessons={lessons.map(({ id, title, url }) => ({ id, title, url }))} />
        </div>

        {/* Learning path */}
        <section id="jalur" aria-labelledby="jalur-title" className="scroll-mt-20 py-20">
          <SectionHeading id="jalur-title" eyebrow="Jalur belajar" title="Tiga modul berurutan">
            Selesaikan satu sebelum lanjut ke berikutnya. Jumlah pelajaran dan durasi dihitung dari materi yang sudah terbit.
          </SectionHeading>
          <PathCards modules={pathModules} />
        </section>

        {/* Topics */}
        <section aria-label="Topik yang dibahas" className="border-t border-border py-14">
          <BlurFade className="mb-6">
            <p className="font-mono text-sm text-muted">{lessons.length} pelajaran, dari instalasi sampai deploy</p>
          </BlurFade>
          <TopicsMarquee topics={topics} />
        </section>

        {/* Facts */}
        <section aria-labelledby="fakta-title" className="border-t border-border py-20">
          <SectionHeading id="fakta-title" eyebrow="Fitur" title="Cara situs ini bekerja" />
          <div className="mt-10">
            <FactsBento lessonIds={lessons.map((l) => l.id)} verified={verified} />
          </div>
        </section>

        {/* FAQ */}
        <section aria-labelledby="faq-title" className="border-t border-border py-20">
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
            <SectionHeading id="faq-title" eyebrow="FAQ" title="Pertanyaan umum" />
            <FaqList items={FAQ} />
          </div>
        </section>

        {/* Closing CTA */}
        {first && (
          <section aria-labelledby="cta-title" className="border-t border-border py-20">
            <BlurFade>
              <div className="flex flex-col items-start gap-6 rounded-lg border border-border bg-surface p-6 sm:flex-row sm:items-center sm:justify-between sm:p-10">
                <div>
                  <h2 id="cta-title" className="font-heading text-2xl">
                    Siap membuat CRUD pertamamu?
                  </h2>
                  <p className="mt-2 text-muted">
                    {first.title} · ± {first.estimatedMinutes} menit
                  </p>
                </div>
                {/* Shine and inner highlight only in dark mode: in light mode this is a plain red button. */}
                <ShimmerButton
                  href={first.url}
                  background="var(--accent)"
                  shimmerColor="var(--cta-shimmer)"
                  borderRadius="8px"
                  shimmerDuration="3.5s"
                  className="min-h-11 px-5 text-sm font-semibold !text-accent-foreground [--cta-shimmer:transparent] dark:[--cta-shimmer:#ffffff] [&>.pointer-events-none]:hidden dark:[&>.pointer-events-none]:block"
                >
                  Mulai pelajaran
                </ShimmerButton>
              </div>
            </BlurFade>
          </section>
        )}
      </div>
    </>
  );
}
