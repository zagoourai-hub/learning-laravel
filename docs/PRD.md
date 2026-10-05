# Epic PRD: Laravel Belajar — Web Tutorial Laravel 13 (Next.js, Hosting Gratis di Vercel)

| Atribut | Nilai |
|---|---|
| Epic Name | Laravel Belajar — Platform Tutorial Laravel 13 |
| Owner | bigboss (Zagoour) |
| Tanggal | 2026-10-05 |
| Status | Draft v1 — siap dieksekusi per fase |
| Lokasi file | `/docs/ways-of-work/plan/laravel-tutorial-web/epic.md` |
| Target hosting | Vercel Hobby (gratis, non-komersial) |

---

## 1. Epic Name

**Laravel Belajar** — situs tutorial berbahasa Indonesia untuk belajar Laravel 13 dari nol: dimulai dari CRUD "full controller" versi pemula, lalu lanjut ke Service Pattern (controller tipis) sebagai *next step*, plus topik lanjutan. Dibangun dengan Next.js 16 (TypeScript), konten MDX di repo, tanpa database, bisa di-hosting gratis di Vercel.

---

## 2. Goal

### 2.1 Problem

- Banyak pemula Laravel berhenti di CRUD karena tutorial berbahasa Indonesia yang ada biasanya sudah memakai banyak abstraksi, atau tidak menjelaskan *kenapa* sebuah kode bekerja (contoh nyata: "`$product` di `show(Product $product)` datang dari mana?", error `View [products.index] not found`, `Product::created()` vs `Product::create()`, nama class huruf kecil yang rusak di Linux).
- Developer dari ekosistem NestJS/Express bertanya "di Laravel ada controller + service seperti NestJS?" tetapi jarang ada tutorial yang menunjukkan **kenapa** dan **kapan** memisahkan logic dari controller, dengan kode sebelum-sesudah yang sama.
- Tutorial berbasis blog biasa tidak punya progres belajar, pencarian cepat, dan jalur belajar bertahap yang jelas.
- Dokumentasi resmi Laravel bersifat referensi (bahasa Inggris), bukan jalur belajar berurutan dengan latihan.

### 2.2 Solution

Situs tutorial statis (Next.js 16 App Router, `output: 'export'`) dengan konten MDX terversi di repo:

1. **Jalur belajar berurutan**: Modul 01 Persiapan → Modul 02 CRUD Pemula (Full Controller) → **Modul 03 Next Step: Service Pattern** → modul lanjutan.
2. **Tutorial kode lengkap** (copy-able, dengan nama file, highlight baris, kolom "sebelum/sesudah") untuk CRUD Product, termasuk **cara pakai SweetAlert2** (konfirmasi hapus + notifikasi sukses).
3. **Kartu "Next Step"** di akhir Modul 02: "Sudah paham CRUD full controller? Lanjut ke Service Pattern", dengan cek prasyarat berdasarkan progres lokal pembaca.
4. **Pencarian konten** (Pagefind, offline-friendly, tanpa server), **progres belajar** (Zustand + localStorage, tanpa akun), dan **komentar/diskusi** (giscus berbasis GitHub Discussions).
5. **Repo pendamping** (`laravel-belajar-demo`, aplikasi Laravel 13 asli) dengan satu commit/tag per pelajaran, supaya semua kode di tutorial terbukti jalan.

### 2.3 Impact

- Pembaca dapat membangun CRUD Laravel 13 yang bekerja dalam ±2 jam, lalu merefaktornya ke Service Pattern tanpa bingung.
- Biaya operasional Rp0 (Vercel Hobby + GitHub gratis), tanpa database/server yang perlu dirawat.
- Konten mudah dirawat: menambah pelajaran = menambah satu file `.mdx` lewat PR, otomatis ada preview deployment.
- Aset konten & kode bisa dipakai ulang untuk konten sosial (@bahas.claude) dan portofolio Zagoour.

---

## 3. User Personas

| Persona | Deskripsi | Kebutuhan utama |
|---|---|---|
| **Pemula Laravel (Rina)** | Mahasiswa/pemula PHP, baru install Laravel, belum paham MVC & route model binding | Langkah sangat rinci, penjelasan "kode ini dari mana", daftar error umum + solusi, latihan mandiri |
| **Developer pindahan (Dika)** | Sudah paham NestJS/Express/Next.js, ingin cepat produktif di Laravel | Padanan konsep (Controller+Service ala NestJS), langsung ke Service Pattern, kode ringkas & idiomatik Laravel 13 |
| **Maintainer konten (bigboss)** | Pemilik situs, menulis & merawat pelajaran | Menulis MDX dengan komponen siap pakai, validasi frontmatter otomatis, preview per PR, tanpa admin panel |

---

## 4. High-Level User Journeys

**J1 — Menemukan & membaca pelajaran**
Landing page → pilih "Mulai Belajar" → Modul 02 → buka pelajaran → baca, salin kode (tombol copy + toast) → tombol "Tandai selesai".

**J2 — Belajar berurutan dengan progres & resume**
Buka situs lagi → kartu "Lanjutkan dari pelajaran terakhir" → selesaikan pelajaran → progres modul naik → pelajaran terakhir Modul 02 menampilkan kartu **Next Step → Modul 03 Service Pattern**.

**J3 — Next Step ke Service Pattern**
Pembaca selesai Modul 02 → klik Next Step → Modul 03 membuka dengan ringkasan "kode controller lama (sebelum)" → refactor bertahap ke `ProductService` + controller tipis → bandingkan sebelum/sesudah → latihan refactor `Book`.
Jika Modul 02 belum selesai, Modul 03 menampilkan banner lembut (tidak memblokir): "Disarankan selesaikan Modul 02 dulu".

**J4 — Mencari sesuatu**
Tekan `Ctrl/⌘ + K` → ketik "route model binding" / "sweetalert" / "View not found" → hasil dengan cuplikan → buka pelajaran, posisi di heading terkait.

**J5 — Bertanya / berdiskusi**
Di bawah pelajaran → komentar giscus (login GitHub) → diskusi tersimpan di GitHub Discussions repo.

**J6 — Maintainer menambah pelajaran**
Buat file `.mdx` + frontmatter → `pnpm dev` → CI memvalidasi frontmatter/link → PR → preview deployment Vercel → merge → rilis otomatis.

---

## 5. Business Requirements

### 5.1 Functional Requirements

| ID | Requirement |
|---|---|
| FR-01 | Situs menyajikan pelajaran dari file MDX di `content/laravel-13/<modul>/<pelajaran>.mdx`; tidak ada database. |
| FR-02 | Setiap pelajaran memiliki frontmatter tervalidasi (Zod 4): `title`, `description`, `module`, `order`, `level` (`pemula`/`menengah`), `laravelVersion`, `lastVerified`, `estimatedMinutes`, `tags`, `prerequisites?`, `nextStep?`. Build gagal jika invalid. |
| FR-03 | Halaman pelajaran memiliki: breadcrumb, meta (level, durasi, versi Laravel, terakhir diverifikasi), daftar isi (TOC) dari heading, navigasi prev/next, sidebar modul. |
| FR-04 | Komponen MDX: `CodeBlock` (nama file, highlight baris, tombol copy), `Callout` (info/tip/warning/danger), `Steps`, `FileTree`, `Tabs`, `Terminal` (perintah artisan), `BeforeAfter` (dua kode berdampingan), `NextStepCard`, `Prerequisite`, `CompleteFile` (blok file final + path + tombol Copy). |
| FR-21 | **Pola "Final Complete File"**: setiap pelajaran yang mengubah file diakhiri bagian *Final Complete …* berisi kalimat "Here's your complete `path/ke/file.php`:" (path sebagai inline code) diikuti satu blok kode **lengkap** bergaya gelap dengan tombol **Copy** di pojok kanan atas, sehingga pembaca bisa menyalin seluruh file sekaligus (lihat Lampiran D). Langkah-langkah sebelumnya tetap memakai potongan kode kecil per method. |
| FR-05 | Syntax highlighting untuk PHP, Blade, JavaScript/TypeScript, bash, JSON, env, SQL; tema terang & gelap. |
| FR-06 | Modul 02 mengajarkan CRUD Product **full di controller** (versi pemula) memakai resource controller + FormRequest + Blade + pagination + pencarian. |
| FR-07 | Modul 03 mengajarkan refactor ke **Service Pattern** (`ProductService`, controller tipis, constructor DI, testing service, alternatif Action/DTO). |
| FR-08 | Pelajaran khusus **SweetAlert2**: konfirmasi hapus (`confirmDelete`) dan notifikasi sukses (`Swal::success`) memakai paket resmi `sweetalert2/laravel`, termasuk `@js()` agar aman dari tanda petik. |
| FR-09 | Pelajaran **Troubleshooting** CRUD: `View not found`, PSR-4/huruf besar-kecil di Linux, `create` vs `created`, `compact()` salah nama, nama parameter route model binding tidak cocok, `Request` vs `FormRequest`. |
| FR-10 | Kartu **Next Step** di akhir Modul 02 menuju Modul 03; banner prasyarat lunak di Modul 03 berdasarkan progres lokal. |
| FR-11 | **Pencarian**: indeks Pagefind dibuat saat build; dialog pencarian (`Ctrl/⌘+K`) dengan filter modul/level dan cuplikan hasil. |
| FR-12 | **Progres belajar**: tandai selesai per pelajaran, persentase per modul, "Lanjutkan belajar", reset progres; disimpan di localStorage (Zustand `persist`), tanpa akun, dengan versi skema penyimpanan. |
| FR-13 | **Komentar/diskusi** per pelajaran lewat giscus (GitHub Discussions), tema mengikuti dark/light, dimuat malas (lazy). |
| FR-14 | Landing page: hero, jalur belajar (3 modul utama), fitur, CTA, FAQ singkat; animasi Motion/Magic UI yang menghormati `prefers-reduced-motion`. |
| FR-15 | SEO: metadata per pelajaran, `sitemap.xml`, `robots.txt`, canonical, Open Graph image, JSON-LD (`Course`/`TechArticle`), `lang="id"`. |
| FR-16 | Toast (Sonner) untuk: kode tersalin, pelajaran ditandai selesai, progres direset. |
| FR-17 | Mode gelap/terang dengan preferensi tersimpan; mengikuti sistem secara default. |
| FR-18 | Halaman 404 informatif dengan pencarian & tautan ke jalur belajar. |
| FR-19 | Repo pendamping `laravel-belajar-demo` (Laravel 13) dengan tag per pelajaran; setiap pelajaran menautkan ke tag/commit terkait. |
| FR-20 | Halaman "Tentang & Kontribusi": lisensi konten, cara lapor typo, cara menambah pelajaran. |

### 5.2 Non-Functional Requirements

**Performa**
- Seluruh halaman dirender statis saat build (`generateStaticParams`, `dynamicParams = false`).
- Target: LCP < 2,5 s (4G), CLS < 0,1, INP < 200 ms; JS first-load halaman pelajaran < 150 KB gzip (di luar giscus & Pagefind yang dimuat malas).
- Pagefind, giscus, dan dialog pencarian dimuat hanya saat dibutuhkan.

**Batas Vercel Hobby (diverifikasi dari dokumen resmi, Okt 2026)**
- Gratis, **khusus non-komersial/pribadi**; 100 GB Fast Data Transfer, 1 jt CDN request, 1 jt function invocation, 100 deployment/hari, Web Analytics 50 rb event/bulan.
- Arsitektur static export → praktis 0 function invocation; estimasi ±200 KB/halaman → kapasitas ±500 rb page view/bulan di bawah batas transfer.
- **Dilarang** memasang iklan/afiliasi/jualan di situs selama di Hobby; jika kelak dimonetisasi → pindah ke Pro atau host statis lain (Cloudflare Pages/GitHub Pages).

**Aksesibilitas**: WCAG 2.2 AA; navigasi keyboard penuh (dialog pencarian, sidebar, tab); kontras kode ≥ 4,5:1; focus ring jelas; `aria-label` pada tombol ikon; animasi dimatikan jika `prefers-reduced-motion`.

**Responsif**: nyaman di lebar 360 px; kode bisa di-scroll horizontal tanpa memecah layout; sidebar jadi sheet di mobile.

**SEO**: semua pelajaran terindeks; `lang="id"`; URL stabil `/belajar/<modul>/<slug>`; redirect jika slug berubah.

**Privasi**: tanpa cookie pelacak sendiri; progres hanya di perangkat pembaca; giscus/GitHub dan Vercel Analytics dijelaskan di halaman Tentang.

**Kualitas konten**: setiap pelajaran memiliki `laravelVersion` & `lastVerified`; setiap blok kode di tutorial **harus** pernah dijalankan di repo demo (tag per pelajaran) sebelum publish.

**Keamanan**: security headers (CSP yang mengizinkan giscus, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`) lewat `vercel.json`; tidak ada secret di klien (hanya `NEXT_PUBLIC_*` ID giscus yang memang publik).

**Maintainability**: TypeScript strict, ESLint + Prettier, CI (lint, typecheck, build, validasi konten, cek tautan); dependensi dikunci `pnpm-lock.yaml`; Dependabot mingguan.

---

## 6. Success Metrics

*(Target di bawah adalah usulan awal; sesuaikan setelah ada data nyata.)*

| Metrik | Target | Cara ukur |
|---|---|---|
| Lighthouse (mobile) — Performance / Accessibility / Best Practices / SEO | ≥ 90 / 100 / ≥ 95 / ≥ 95 | Lighthouse CI di preview deployment |
| Core Web Vitals (field) | LCP < 2,5 s, CLS < 0,1 | Vercel Web Analytics / Speed Insights (sesuai kuota Hobby) |
| Kelengkapan konten MVP | 100% pelajaran Modul 01–03 terbit (±24 pelajaran) | Validasi frontmatter + checklist fase 5 |
| Kode terbukti jalan | 100% blok kode inti punya tag di repo demo | Checklist per pelajaran |
| Konversi Next Step | ≥ 25% pembaca halaman terakhir Modul 02 membuka halaman pertama Modul 03 | Rasio page view (tanpa event kustom) |
| Pertumbuhan | ≥ 1.000 kunjungan/bulan dalam 90 hari setelah rilis | Vercel Web Analytics |
| Interaksi komunitas | ≥ 20 diskusi giscus dalam 90 hari | GitHub Discussions |
| Waktu build | < 3 menit | Log Vercel/CI |
| Biaya bulanan | Rp0 | Dashboard Vercel (tidak ada tagihan/limit tercapai) |

---

## 7. Out of Scope (MVP)

- Akun pengguna, login, database, sinkronisasi progres lintas perangkat.
- Quiz/ujian & sertifikat (tidak dipilih untuk MVP).
- Playground PHP/Laravel di browser (mustahil di Vercel; gunakan repo pendamping / Laravel Herd / Docker).
- Hosting video; video eksplanasi hanya disematkan (embed) bila ada.
- Multi-bahasa (hanya Bahasa Indonesia).
- Admin panel/CMS (konten lewat Git + PR).
- Monetisasi (iklan, afiliasi, kursus berbayar) — dilarang oleh Vercel Hobby.
- Menjalankan aplikasi Laravel demo di Vercel (demo Laravel hanya sebagai kode sumber/repo).
- Fitur AI ([AI] tidak dipakai di MVP; kandidat pasca-MVP: asisten tanya-jawab konten).
- TanStack Query & React Hook Form (tidak ada server state / form kompleks di MVP; dipasang hanya jika kelak ada form/API).

---

## 8. Business Value

**Tinggi.** Nol biaya operasional, aset konten reusable (blog, sosial media, portofolio), memperkuat brand Zagoour sebagai edukator developer, dan menjadi template situs dokumentasi/tutorial statis yang dapat dipakai ulang untuk tutorial framework lain. Risiko rendah karena tanpa backend/database dan seluruh konten terversi di Git.

---

## 9. Keputusan Arsitektur & Asumsi

| # | Keputusan | Alasan / Trade-off |
|---|---|---|
| A1 | **Satu app Next.js di root** (bukan `frontend/` + `backend/`) | Standar Zagoour default `frontend/` + `backend/`, namun proyek ini tidak punya backend terpisah; satu app paling sederhana untuk Vercel Hobby. *Deviasi disengaja.* |
| A2 | **Static export** (`output: 'export'`, `images.unoptimized: true`) | 0 function invocation, aman di batas Hobby, Pagefind bisa mengindeks `out/`. Trade-off: tanpa ISR/Route Handler dinamis. Wajib diuji di Spike 0.1.5–0.1.6. |
| A3 | "Fullstack" = Server Components + build-time (loader konten, `sitemap.ts`, `robots.ts`, skrip postbuild) | Tidak ada database ⇒ tidak perlu API runtime. Jika kelak butuh API, lepas `output: 'export'` dan tambah Route Handlers. |
| A4 | Konten MDX di repo dengan frontmatter divalidasi Zod 4 | Terversi di Git, review lewat PR, tanpa DB. Perlu `remark-frontmatter` + parser frontmatter sendiri karena `@next/mdx` tidak mem-parse frontmatter secara default. |
| A5 | Plugin MDX memakai **nama string + opsi serializable** | Syarat Turbopack untuk `@next/mdx`. Pemilihan highlighter ditentukan di Spike 0.1.4. |
| A6 | Pencarian: **Pagefind** (opsi lain: Fuse.js index JSON, Algolia DocSearch) | Pagefind: tanpa server, indeks kecil, UI siap pakai. Fuse.js lebih sederhana tapi kurang kuat untuk teks panjang; Algolia butuh pendaftaran & kuota. |
| A7 | Komentar: **giscus** (opsi lain: Disqus, utterances) | Gratis, tanpa iklan, data di GitHub Discussions. Syarat: repo publik, giscus app terpasang, Discussions aktif. |
| A8 | Progres: **Zustand `persist`** ke localStorage dengan `skipHydration` + rehydrate manual | Tanpa akun. Trade-off: progres tidak lintas perangkat. |
| A9 | Kode tutorial diuji di **repo pendamping** | Menjamin akurasi; setiap pelajaran punya tag Git. |
| A10 | Versi paket (Next 16.x, TypeScript 7, Tailwind, Pagefind 1.5.x, `sweetalert2/laravel`) **diverifikasi saat Spike Fase 0** | Hindari asumsi kompatibilitas; fallback TypeScript 5.x bila TS 7 bermasalah. |

---

## 10. Struktur Folder (Lampiran A)

```text
laravel-belajar/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                         # landing
│   ├── not-found.tsx
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── tentang/page.tsx
│   └── belajar/
│       ├── layout.tsx                   # sidebar + shell
│       ├── page.tsx                     # daftar modul
│       └── [module]/
│           ├── page.tsx                 # daftar pelajaran modul
│           └── [slug]/page.tsx          # halaman pelajaran
├── content/
│   └── laravel-13/
│       ├── 01-persiapan/*.mdx
│       ├── 02-crud-pemula/*.mdx
│       └── 03-service-pattern/*.mdx
├── components/
│   ├── ui/                              # shadcn
│   ├── magicui/                         # Magic UI
│   ├── mdx/                             # CodeBlock, Callout, Steps, FileTree, BeforeAfter, NextStepCard
│   ├── layout/                          # Header, Footer, Sidebar, ThemeToggle
│   └── learn/                           # ProgressButton, ProgressBar, ResumeCard, SearchDialog, Comments, Toc
├── lib/
│   ├── content.ts                       # loader & indexer konten
│   ├── schemas.ts                       # Zod 4 frontmatter
│   ├── env.ts                           # validasi NEXT_PUBLIC_*
│   └── utils.ts
├── stores/progress-store.ts
├── scripts/postbuild-pagefind.mjs
├── public/
├── .github/workflows/ci.yml
├── mdx-components.tsx
├── next.config.mjs
├── components.json
├── vercel.json
└── package.json
```

## 11. Contoh Frontmatter (Lampiran B)

```yaml
---
title: "Controller Resource & CRUD Product"
description: "Membuat resource controller dan seluruh method CRUD untuk Product."
module: "02-crud-pemula"
order: 3
level: "pemula"
laravelVersion: "13.x"
lastVerified: "2026-10-05"
estimatedMinutes: 15
tags: ["controller", "crud", "resource"]
prerequisites: ["02-crud-pemula/02-migration-model"]
nextStep: "02-crud-pemula/04-layout-index"
---
```

## 11b. Pola Penulisan Tutorial Kode (Lampiran D)

Mengikuti gaya tutorial referensi yang diinginkan (heading "Final Complete Controller", kalimat pengantar dengan path file, lalu satu blok kode gelap dengan tombol Copy):

````mdx
## Final Complete Controller

Here's your complete <code>app/Http/Controllers/ProductController.php</code>:

<CompleteFile path="app/Http/Controllers/ProductController.php" lang="php">
{`<?php

namespace App\Http\Controllers;

use App\Models\Product;
// ... seluruh isi file ...
`}
</CompleteFile>
````

Aturan pola:
1. Alur pelajaran: **penjelasan → potongan kode per langkah → Final Complete File → cara menguji (browser/artisan) → error umum**.
2. Satu file final per file yang diubah di pelajaran itu (controller, route, FormRequest, view Blade).
3. Blok kode final selalu bertema gelap (terbaca sama di mode terang/gelap), ada tombol **Copy** (toast "Kode tersalin"), bahasa PHP/Blade ter-highlight, dan dapat di-scroll horizontal di mobile.
4. Kode di blok final **identik** dengan isi file di repo demo pada tag pelajaran tersebut (diverifikasi manual per PR; kandidat otomatisasi: skrip yang membandingkan blok dengan file di tag).
5. Request class mengikuti default Laravel 13 (`--requests` → `StoreProductRequest` & `UpdateProductRequest`); varian satu `ProductRequest` disebut sebagai catatan.

## 12. Kurikulum (Lampiran C)

**Modul 01 — Persiapan** (4 pelajaran): roadmap & apa itu Laravel · instalasi (PHP, Composer, `laravel new`, `composer run dev`) · struktur folder · routing dasar & `php artisan route:list`.

**Modul 02 — CRUD Pemula (Full Controller)** (12 pelajaran): rencana CRUD Product · migration & model (`$fillable`) · resource controller · layout Blade & halaman index + pagination · create & store (FormRequest, validasi, `old()`, `@error`) · show & route model binding ("`$product` dari mana?") · edit & update · destroy · pencarian · **SweetAlert2** · troubleshooting umum · latihan mandiri CRUD `Book` + checklist "siap lanjut".

**Modul 03 — Next Step: Service Pattern** (8 pelajaran): kenapa controller gemuk bermasalah · membuat `ProductService` · controller tipis + constructor DI · memindah query/logic ke service · testing service · alternatif Action/DTO · kapan perlu & kapan tidak · latihan refactor `Book`.

**Modul 04+ (pasca-MVP, "dan lain-lain")**: Eloquent relationships · autentikasi (starter kit) · API Resource & REST · testing (Pest/PHPUnit) · deploy Laravel.

---

# Task List

> Format: **Fase → Feature Group → Sub-task atomik**. Tag: `[FE]` frontend/UI/konten, `[BE]` build-time/server-side (loader, route metadata, skrip build), `[AI]` fitur AI (tidak dipakai di MVP), `[OPS]` infra/CI/deploy/konfigurasi/verifikasi. Setiap sub-task = satu file/fungsi/konfigurasi.

## Fase 0 — Validasi & Spike

### 0.1 Spike kompatibilitas stack
- [ ] 0.1.1 [OPS] Scaffold app Next.js 16 kosong dengan pnpm di branch `spike/stack`
- [ ] 0.1.2 [FE] Uji build Next 16 + TypeScript 7; catat hasil; fallback ke TypeScript 5.x bila gagal
- [ ] 0.1.3 [FE] Uji `@next/mdx` + Turbopack dengan satu file `.mdx` dan `mdx-components.tsx`
- [ ] 0.1.4 [FE] Bandingkan highlighter `rehype-pretty-code` vs `@shikijs/rehype` dengan opsi serializable; pilih satu
- [ ] 0.1.5 [OPS] Uji `output: 'export'` + `images.unoptimized: true`; deploy preview ke Vercel
- [ ] 0.1.6 [OPS] Uji Pagefind pada folder `out/` dan pastikan `out/pagefind` ter-serve di Vercel
- [ ] 0.1.7 [FE] Uji Zustand `persist` + `skipHydration` tanpa hydration mismatch
- [ ] 0.1.8 [FE] Uji giscus (`@giscus/react`) di repo publik percobaan
- [ ] 0.1.9 [OPS] Verifikasi `sweetalert2/laravel` + `@include('sweetalert2::index')` berjalan di Laravel 13
- [ ] 0.1.10 [OPS] Tulis `docs/adr/0001-stack-decisions.md` berisi hasil spike dan keputusan akhir

### 0.2 Akun & repositori
- [ ] 0.2.1 [OPS] Buat repo GitHub **publik** `laravel-belajar`
- [ ] 0.2.2 [OPS] Aktifkan GitHub Discussions di repo
- [ ] 0.2.3 [OPS] Pasang giscus app; catat `repoId` dan `categoryId`
- [ ] 0.2.4 [OPS] Hubungkan repo ke Vercel (plan Hobby) dan aktifkan preview deployment per PR
- [ ] 0.2.5 [OPS] Buat repo publik `laravel-belajar-demo` (Laravel 13, SQLite default)
- [ ] 0.2.6 [OPS] Tentukan lisensi kode (MIT) dan lisensi konten (mis. CC BY-NC-SA 4.0); catat di ADR

## Fase 1 — Setup Proyek & Infrastruktur

### 1.1 Scaffold & konfigurasi dasar
- [ ] 1.1.1 [OPS] Inisialisasi proyek Next.js 16 (TypeScript, App Router, Tailwind) di root repo dengan pnpm
- [ ] 1.1.2 [OPS] Set `packageManager` dan `engines` di `package.json`; tambah `.nvmrc`
- [ ] 1.1.3 [FE] Konfigurasi `tsconfig.json` strict + path alias `@/*`
- [ ] 1.1.4 [OPS] Tambah `.editorconfig`
- [ ] 1.1.5 [OPS] Lengkapi `.gitignore` (`.next`, `out`, `public/pagefind`, `.env*.local`)
- [ ] 1.1.6 [FE] Atur `next.config.mjs`: `output: 'export'`, `images.unoptimized`, `trailingSlash`, `pageExtensions` termasuk `mdx`

### 1.2 Dependensi
- [ ] 1.2.1 [FE] Inisialisasi shadcn/ui (`pnpm dlx shadcn@latest init`) → `components.json`
- [ ] 1.2.2 [FE] Tambah komponen shadcn: `button`, `card`, `badge`, `dialog`, `command`, `sheet`, `tabs`, `separator`, `scroll-area`, `progress`, `tooltip`
- [ ] 1.2.3 [FE] Pasang Motion (`motion`) dan buat util impor `motion/react`
- [ ] 1.2.4 [FE] Tambah komponen Magic UI yang dipakai (mis. hero/animated list) via `shadcn add @magicui/<nama>`
- [ ] 1.2.5 [FE] Pasang Sonner dan tambahkan `<Toaster />` di `app/layout.tsx`
- [ ] 1.2.6 [FE] Pasang `next-themes` dan buat `ThemeProvider`
- [ ] 1.2.7 [FE] Pasang Zustand (`zustand`)
- [ ] 1.2.8 [FE] Pasang Zod 4 (`zod`)
- [ ] 1.2.9 [FE] Pasang `@next/mdx`, `@mdx-js/loader`, `@mdx-js/react`, `@types/mdx`
- [ ] 1.2.10 [FE] Pasang plugin remark/rehype: `remark-gfm`, `remark-frontmatter`, `rehype-slug`, `rehype-autolink-headings`, highlighter terpilih
- [ ] 1.2.11 [FE] Pasang `gray-matter` (atau `yaml`) untuk membaca frontmatter di loader
- [ ] 1.2.12 [FE] Pasang `@giscus/react`
- [ ] 1.2.13 [OPS] Pasang `pagefind` sebagai devDependency

### 1.3 Tooling kualitas
- [ ] 1.3.1 [OPS] Konfigurasi ESLint (flat config) dengan aturan Next + TypeScript
- [ ] 1.3.2 [OPS] Konfigurasi Prettier + `prettier-plugin-tailwindcss`
- [ ] 1.3.3 [OPS] Tambah script `lint`, `typecheck`, `format`, `validate:content` di `package.json`
- [ ] 1.3.4 [OPS] Tambah `.github/dependabot.yml` (mingguan, npm + github-actions)

### 1.4 Environment
- [ ] 1.4.1 [BE] Buat `lib/env.ts`: validasi `NEXT_PUBLIC_SITE_URL` dan `NEXT_PUBLIC_GISCUS_*` dengan Zod
- [ ] 1.4.2 [OPS] Buat `.env.example` berisi semua variabel `NEXT_PUBLIC_*`
- [ ] 1.4.3 [OPS] Isi environment variables di dashboard Vercel (Production + Preview)

### 1.5 CI/CD & hosting
- [ ] 1.5.1 [OPS] Buat `.github/workflows/ci.yml`: install, lint, typecheck, `validate:content`, build
- [ ] 1.5.2 [OPS] Tambah job cek tautan internal/eksternal (mis. `lychee`) di workflow
- [ ] 1.5.3 [OPS] Buat `vercel.json`: security headers (CSP termasuk `giscus.app`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`)
- [ ] 1.5.4 [OPS] Tambah aturan cache di `vercel.json` untuk `/pagefind/*` dan aset statis
- [ ] 1.5.5 [OPS] Atur build command Vercel: `pnpm build` (termasuk postbuild Pagefind) dan output directory `out`
- [ ] 1.5.6 [OPS] Verifikasi preview deployment pertama berjalan hijau

## Fase 2 — Content Engine (MDX)

### 2.1 Model & validasi konten
- [ ] 2.1.1 [BE] Definisikan `lessonFrontmatterSchema` (Zod 4) di `lib/schemas.ts`
- [ ] 2.1.2 [BE] Definisikan tipe `Lesson`, `ModuleMeta` turunan schema
- [ ] 2.1.3 [BE] Buat `content/laravel-13/_modules.ts` berisi metadata modul (judul, deskripsi, urutan, level)
- [ ] 2.1.4 [BE] Tulis skrip `scripts/validate-content.ts`: validasi seluruh frontmatter, slug unik, urutan tidak bentrok
- [ ] 2.1.5 [BE] Tambah validasi referensi `prerequisites`/`nextStep` menunjuk pelajaran yang ada

### 2.2 Loader konten
- [ ] 2.2.1 [BE] `lib/content.ts`: fungsi `getModules()`
- [ ] 2.2.2 [BE] `lib/content.ts`: fungsi `getLessonsByModule(module)`
- [ ] 2.2.3 [BE] `lib/content.ts`: fungsi `getLesson(module, slug)` (frontmatter + path impor)
- [ ] 2.2.4 [BE] `lib/content.ts`: fungsi `getAdjacentLessons(module, slug)` untuk prev/next
- [ ] 2.2.5 [BE] `lib/content.ts`: fungsi `getAllLessonParams()` untuk `generateStaticParams`
- [ ] 2.2.6 [BE] `lib/content.ts`: ekstraksi heading (h2/h3) untuk TOC

### 2.3 Pipeline MDX
- [ ] 2.3.1 [FE] Konfigurasi `createMDX` di `next.config.mjs` dengan plugin bernama string (Turbopack)
- [ ] 2.3.2 [FE] Buat `mdx-components.tsx` (pemetaan elemen → komponen)
- [ ] 2.3.3 [FE] Konfigurasi highlighter: bahasa `php`, `blade`, `js`, `ts`, `bash`, `json`, `sql`, `ini` (env)
- [ ] 2.3.4 [FE] Konfigurasi tema kode terang & gelap
- [ ] 2.3.5 [FE] Dukungan meta kode: `title="..."`, `{1,3-5}` highlight baris, `showLineNumbers`
- [ ] 2.3.6 [FE] Atur `rehype-autolink-headings` (anchor di heading, aksesibel)

### 2.4 Komponen MDX
- [ ] 2.4.1 [FE] `components/mdx/code-block.tsx`: tampilan blok kode + judul file
- [ ] 2.4.2 [FE] `components/mdx/copy-button.tsx`: salin kode + toast Sonner
- [ ] 2.4.3 [FE] `components/mdx/callout.tsx`: varian info/tip/warning/danger
- [ ] 2.4.4 [FE] `components/mdx/steps.tsx`: daftar langkah bernomor
- [ ] 2.4.5 [FE] `components/mdx/file-tree.tsx`: pohon folder Laravel
- [ ] 2.4.6 [FE] `components/mdx/terminal.tsx`: blok perintah artisan/composer (tanpa prompt saat disalin)
- [ ] 2.4.7 [FE] `components/mdx/before-after.tsx`: dua kode berdampingan (desktop) / bertumpuk (mobile)
- [ ] 2.4.8 [FE] `components/mdx/next-step-card.tsx`: kartu ajakan ke modul berikutnya
- [ ] 2.4.9 [FE] `components/mdx/prerequisite.tsx`: daftar prasyarat dengan status selesai dari progres
- [ ] 2.4.10 [FE] `components/mdx/tabs.tsx`: pembungkus shadcn Tabs untuk MDX (mis. Windows/macOS/Linux)
- [ ] 2.4.11 [FE] `components/mdx/figure.tsx`: gambar + caption (non-optimized)
- [ ] 2.4.12 [FE] Daftarkan semua komponen di `mdx-components.tsx`
- [ ] 2.4.13 [FE] `components/mdx/complete-file.tsx`: label path (inline code) + blok kode final gelap + tombol Copy di pojok kanan atas
- [ ] 2.4.14 [FE] Gaya blok `CompleteFile`: tema gelap tetap di mode terang/gelap, scroll horizontal, kontras ≥ 4,5:1
- [ ] 2.4.15 [FE] Tambah heading anchor otomatis untuk bagian "Final Complete …" agar bisa ditautkan & muncul di TOC
- [ ] 2.4.16 [OPS] Tulis `docs/content-pattern.md`: aturan pola Final Complete File (Lampiran D)

### 2.5 Routing konten
- [ ] 2.5.1 [FE] `app/belajar/[module]/[slug]/page.tsx`: render MDX + `generateStaticParams` + `dynamicParams = false`
- [ ] 2.5.2 [BE] `generateMetadata` per pelajaran (title, description, canonical, OG)
- [ ] 2.5.3 [FE] `app/belajar/[module]/page.tsx`: daftar pelajaran per modul
- [ ] 2.5.4 [FE] `app/belajar/page.tsx`: daftar modul + progres ringkas
- [ ] 2.5.5 [FE] Redirect/alias slug lama lewat `redirects` bila slug berubah (catat di ADR)

## Fase 3 — Layout & UI

### 3.1 Desain dasar
- [ ] 3.1.1 [FE] Definisikan design tokens (warna, radius, font) di `app/globals.css`
- [ ] 3.1.2 [FE] Pasang font (`next/font`) untuk teks dan monospace kode
- [ ] 3.1.3 [FE] Gaya prose untuk konten MDX (`.prose` kustom atau Tailwind typography)
- [ ] 3.1.4 [FE] Toggle tema terang/gelap (`ThemeToggle`)

### 3.2 Shell aplikasi
- [ ] 3.2.1 [FE] `components/layout/header.tsx`: logo, navigasi, tombol cari, toggle tema
- [ ] 3.2.2 [FE] `components/layout/footer.tsx`: tautan, lisensi, kontribusi
- [ ] 3.2.3 [FE] `components/layout/sidebar.tsx`: daftar modul & pelajaran, penanda aktif, centang selesai
- [ ] 3.2.4 [FE] `components/layout/mobile-nav.tsx`: sidebar sebagai `Sheet` di mobile
- [ ] 3.2.5 [FE] `app/layout.tsx`: html `lang="id"`, providers, Header/Footer
- [ ] 3.2.6 [FE] `app/belajar/layout.tsx`: grid sidebar + konten + TOC

### 3.3 Landing page
- [ ] 3.3.1 [FE] `components/landing/hero.tsx` (Magic UI + Motion)
- [ ] 3.3.2 [FE] `components/landing/learning-path.tsx`: 3 modul utama + panah "Next Step"
- [ ] 3.3.3 [FE] `components/landing/features.tsx`: pencarian, progres, kode siap salin, repo demo
- [ ] 3.3.4 [FE] `components/landing/cta.tsx`: tombol "Mulai Belajar"
- [ ] 3.3.5 [FE] `components/landing/faq.tsx`: FAQ singkat (gratis? perlu apa? versi Laravel?)
- [ ] 3.3.6 [FE] `app/page.tsx`: susun seluruh seksi landing

### 3.4 Halaman pelajaran
- [ ] 3.4.1 [FE] `components/learn/lesson-header.tsx`: judul, level, durasi, versi Laravel, `lastVerified`
- [ ] 3.4.2 [FE] `components/learn/breadcrumb.tsx`
- [ ] 3.4.3 [FE] `components/learn/toc.tsx`: daftar isi dengan penyorotan heading aktif
- [ ] 3.4.4 [FE] `components/learn/lesson-pager.tsx`: tombol sebelumnya/berikutnya
- [ ] 3.4.5 [FE] `components/learn/repo-link.tsx`: tautan ke tag di repo demo

### 3.5 Halaman lain
- [ ] 3.5.1 [FE] `app/not-found.tsx` dengan kotak pencarian & tautan jalur belajar
- [ ] 3.5.2 [FE] `app/tentang/page.tsx`: tentang, lisensi, privasi, cara kontribusi
- [ ] 3.5.3 [FE] `app/error.tsx` / `global-error.tsx`

### 3.6 Animasi & aksesibilitas UI
- [ ] 3.6.1 [FE] Util `useReducedMotion` dan terapkan di komponen animasi
- [ ] 3.6.2 [FE] Skip-link "Lewati ke konten" di layout
- [ ] 3.6.3 [FE] Audit focus ring & `aria-label` tombol ikon

## Fase 4 — Fitur Belajar (MVP)

### 4.1 Progres belajar
- [ ] 4.1.1 [FE] `stores/progress-store.ts`: state `completed: Record<lessonId, ISODate>`, `lastVisited`
- [ ] 4.1.2 [FE] Tambah `persist` (`createJSONStorage`, `partialize`, `version`, `migrate`, `skipHydration`)
- [ ] 4.1.3 [FE] Aksi `toggleComplete`, `visit`, `reset`
- [ ] 4.1.4 [FE] Selector `moduleProgress(module)` dan `isModuleComplete(module)`
- [ ] 4.1.5 [FE] `components/learn/progress-hydrator.tsx`: panggil `rehydrate()` di `useEffect`
- [ ] 4.1.6 [FE] `components/learn/complete-button.tsx`: tandai selesai + toast
- [ ] 4.1.7 [FE] `components/learn/module-progress.tsx`: bar progres per modul
- [ ] 4.1.8 [FE] `components/learn/resume-card.tsx`: "Lanjutkan dari pelajaran terakhir"
- [ ] 4.1.9 [FE] Tombol "Reset progres" dengan dialog konfirmasi di halaman Tentang
- [ ] 4.1.10 [FE] Catat kunjungan terakhir saat halaman pelajaran dibuka (`visit`)

### 4.2 Alur Next Step & prasyarat
- [ ] 4.2.1 [FE] Hubungkan `Prerequisite` ke progres store (status selesai/belum)
- [ ] 4.2.2 [FE] `components/learn/prereq-banner.tsx`: banner lunak di Modul 03 jika Modul 02 belum selesai
- [ ] 4.2.3 [FE] Tampilkan `NextStepCard` aktif hanya saat pelajaran terakhir modul; tampilkan status progres modul
- [ ] 4.2.4 [FE] Tambah `nextStep` modul di `_modules.ts` (02 → 03) dan baca di kartu

### 4.3 Pencarian (Pagefind)
- [ ] 4.3.1 [BE] `scripts/postbuild-pagefind.mjs`: jalankan `pagefind --site out` ke `out/pagefind`
- [ ] 4.3.2 [OPS] Tambah script `postbuild` di `package.json`
- [ ] 4.3.3 [FE] Tandai konten dengan `data-pagefind-body`; abaikan sidebar/nav dengan `data-pagefind-ignore`
- [ ] 4.3.4 [FE] Tambah `data-pagefind-filter` untuk `module` dan `level`; `data-pagefind-meta` untuk judul
- [ ] 4.3.5 [FE] `components/learn/search-dialog.tsx`: dialog `Command`, muat Pagefind secara malas
- [ ] 4.3.6 [FE] Shortcut `Ctrl/⌘ + K` dan tombol cari di header
- [ ] 4.3.7 [FE] Tampilan hasil: judul, cuplikan ber-highlight, penanda modul
- [ ] 4.3.8 [FE] State kosong & error (indeks belum dibuat saat `pnpm dev`)
- [ ] 4.3.9 [OPS] Dokumentasikan di README: pencarian hanya aktif setelah `pnpm build` + `pnpm start`/serve `out`

### 4.4 Komentar (giscus)
- [ ] 4.4.1 [FE] `components/learn/comments.tsx`: bungkus `@giscus/react` (mapping `pathname`)
- [ ] 4.4.2 [FE] Sinkronkan tema giscus dengan `next-themes`
- [ ] 4.4.3 [FE] Muat giscus malas (IntersectionObserver) di akhir pelajaran
- [ ] 4.4.4 [FE] Pesan fallback bila env giscus tidak diisi
- [ ] 4.4.5 [OPS] Verifikasi diskusi terbentuk di kategori yang benar pada deployment produksi

### 4.5 Notifikasi UI
- [ ] 4.5.1 [FE] Toast "Kode tersalin" pada `CopyButton`
- [ ] 4.5.2 [FE] Toast "Pelajaran selesai" / "Progres direset"

## Fase 5 — Konten (Modul 01–03)

> Setiap pelajaran memiliki 3 sub-task: (a) tulis `.mdx` + frontmatter, (b) kode diuji di repo demo + beri tag, (c) review akurasi terhadap dokumentasi resmi Laravel 13.

### 5.1 Repo demo
- [ ] 5.1.1 [OPS] Inisialisasi proyek Laravel 13 di `laravel-belajar-demo` (`laravel new`)
- [ ] 5.1.2 [OPS] Tulis README demo: prasyarat, cara jalan (`composer run dev`), daftar tag per pelajaran
- [ ] 5.1.3 [OPS] Konvensi tag: `m02-l03-resource-controller` dst.; dokumentasikan

### 5.2 Modul 01 — Persiapan
- [ ] 5.2.1 [FE] Tulis `01-persiapan/01-roadmap-laravel.mdx`
- [ ] 5.2.2 [FE] Tulis `01-persiapan/02-instalasi.mdx` (PHP 8.3+, Composer, `laravel new`, `composer run dev`)
- [ ] 5.2.3 [OPS] Uji instalasi di Windows & Linux; catat jebakan umum
- [ ] 5.2.4 [FE] Tulis `01-persiapan/03-struktur-folder.mdx` (dengan `FileTree`)
- [ ] 5.2.5 [FE] Tulis `01-persiapan/04-routing-dasar.mdx` (`web.php`, `php artisan route:list`)
- [ ] 5.2.6 [OPS] Tag demo `m01-*` untuk pelajaran 02–04
- [ ] 5.2.7 [FE] Review akurasi Modul 01 terhadap dokumentasi resmi

### 5.3 Modul 02 — CRUD Pemula (Full Controller)
- [ ] 5.3.1 [FE] Tulis `02-crud-pemula/01-rencana-crud-product.mdx` (ERD tabel `products`, daftar route)
- [ ] 5.3.2 [FE] Tulis `02-crud-pemula/02-migration-model.mdx` (`make:model -m`, `$fillable`)
- [ ] 5.3.3 [OPS] Tag demo `m02-l02-migration-model` + uji `php artisan migrate`
- [ ] 5.3.4 [FE] Tulis `02-crud-pemula/03-resource-controller.mdx` (`make:controller --resource --model=Product --requests`, `Route::resource`)
- [ ] 5.3.5 [OPS] Tag demo `m02-l03-resource-controller`
- [ ] 5.3.6 [FE] Tulis `02-crud-pemula/04-layout-index.mdx` (layout Blade, `index()`, tabel, `paginate()->withQueryString()`)
- [ ] 5.3.7 [OPS] Tag demo `m02-l04-layout-index`
- [ ] 5.3.8 [FE] Tulis `02-crud-pemula/05-create-store.mdx` (`create()`, `store()`, `StoreProductRequest`, `old()`, `@error`, `Product::create`; catatan varian `ProductRequest` tunggal)
- [ ] 5.3.9 [OPS] Tag demo `m02-l05-create-store`
- [ ] 5.3.10 [FE] Tulis `02-crud-pemula/06-show-route-model-binding.mdx` (jawaban "`$product` dari mana", syarat nama variabel = parameter route, PascalCase)
- [ ] 5.3.11 [OPS] Tag demo `m02-l06-show`
- [ ] 5.3.12 [FE] Tulis `02-crud-pemula/07-edit-update.mdx` (`@method('PUT')`, `compact('product')`)
- [ ] 5.3.13 [OPS] Tag demo `m02-l07-edit-update`
- [ ] 5.3.14 [FE] Tulis `02-crud-pemula/08-destroy.mdx` (`@method('DELETE')`, `to_route()`)
- [ ] 5.3.15 [OPS] Tag demo `m02-l08-destroy`
- [ ] 5.3.16 [FE] Tulis `02-crud-pemula/09-pencarian.mdx` (`when()`, `where/orWhere`, `trim()->toString()`, catatan `Stringable` selalu truthy)
- [ ] 5.3.17 [OPS] Tag demo `m02-l09-search`
- [ ] 5.3.18 [FE] Tulis `02-crud-pemula/10-sweetalert2.mdx` — bagian A: instal `sweetalert2` + `sweetalert2/laravel`, `window.Swal`, `@include('sweetalert2::index')`
- [ ] 5.3.19 [FE] Lanjutan 10 — bagian B: `confirmDelete(form, name)` di `resources/js/app.js` + tombol Blade memakai `@js($product->name)`
- [ ] 5.3.20 [FE] Lanjutan 10 — bagian C: `Swal::success` / `Swal::toastSuccess` di `store`, `update`, `destroy`
- [ ] 5.3.21 [FE] Lanjutan 10 — bagian D: pitfall (tanda petik di nama produk, `type="button"`, Vite harus jalan)
- [ ] 5.3.22 [OPS] Tag demo `m02-l10-sweetalert2` + uji alert konfirmasi & sukses
- [ ] 5.3.23 [FE] Tulis `02-crud-pemula/11-troubleshooting.mdx` — `View not found` & `make:view`
- [ ] 5.3.24 [FE] Lanjutan 11: PSR-4 & huruf besar/kecil di Linux (rename dua langkah, `composer dump-autoload`)
- [ ] 5.3.25 [FE] Lanjutan 11: `Product::created()` vs `create()`, `compact()` typo, `Request` vs `FormRequest`
- [ ] 5.3.26 [FE] Lanjutan 11: parameter route model binding tidak cocok (model kosong tanpa error)
- [ ] 5.3.27 [FE] Tulis `02-crud-pemula/12-latihan-dan-checklist.mdx` (latihan CRUD `Book`, checklist "siap lanjut" ke Service Pattern)
- [ ] 5.3.28 [FE] Pasang `NextStepCard` di akhir pelajaran 12 menuju `03-service-pattern/01-…`
- [ ] 5.3.29 [OPS] Tag demo `m02-final` berisi CRUD Product full controller (titik awal Modul 03)
- [ ] 5.3.31 [FE] Tambah bagian **Final Complete Routes** (`routes/web.php`) di pelajaran 03 memakai `CompleteFile`
- [ ] 5.3.32 [FE] Tambah bagian **Final Complete Controller** (`ProductController.php` lengkap: index, create, store, show, edit, update, destroy) di pelajaran 08
- [ ] 5.3.33 [FE] Tambah **Final Complete FormRequest** (`StoreProductRequest.php`, `UpdateProductRequest.php`) di pelajaran 05/07
- [ ] 5.3.34 [FE] Tambah **Final Complete Views** (`layout`, `index`, `create`, `edit`, `show` Blade) di pelajaran 04–07
- [ ] 5.3.35 [FE] Tambah **Final Complete** `resources/js/app.js` + `index.blade.php` (SweetAlert2) di pelajaran 10
- [ ] 5.3.36 [OPS] Cocokkan tiap blok final dengan file di tag demo (`diff`) sebelum publish
- [ ] 5.3.37 [FE] Review akurasi Modul 02 terhadap dokumentasi Laravel 13 (controllers, validation, routing, Blade)

### 5.4 Modul 03 — Next Step: Service Pattern
- [ ] 5.4.1 [FE] Tulis `03-service-pattern/01-kenapa-controller-gemuk.mdx` (masalah, padanan Controller+Service ala NestJS)
- [ ] 5.4.2 [FE] Tambahkan `BeforeAfter` di pelajaran 01: controller `store()` lama vs gambaran akhir
- [ ] 5.4.3 [FE] Tulis `03-service-pattern/02-membuat-product-service.mdx` (`app/Services/ProductService.php`: `paginate`, `create`, `update`, `delete`)
- [ ] 5.4.4 [OPS] Tag demo `m03-l02-product-service`
- [ ] 5.4.5 [FE] Tulis `03-service-pattern/03-controller-tipis-di.mdx` (constructor injection, `ProductController` tipis)
- [ ] 5.4.6 [OPS] Tag demo `m03-l03-thin-controller`; pastikan perilaku sama dengan `m02-final`
- [ ] 5.4.7 [FE] Tulis `03-service-pattern/04-memindah-logic.mdx` (query/pencarian/transaksi ke service; FormRequest tetap untuk validasi)
- [ ] 5.4.8 [OPS] Tag demo `m03-l04-move-logic`
- [ ] 5.4.9 [FE] Tulis `03-service-pattern/05-testing-service.mdx` (feature test + unit test sederhana)
- [ ] 5.4.10 [OPS] Tag demo `m03-l05-tests`; jalankan `php artisan test`
- [ ] 5.4.11 [FE] Tulis `03-service-pattern/06-alternatif-action-dto.mdx` (Action class, DTO; trade-off)
- [ ] 5.4.12 [FE] Tulis `03-service-pattern/07-kapan-perlu-service.mdx` (kapan perlu / tidak, bahaya over-engineering)
- [ ] 5.4.13 [FE] Tulis `03-service-pattern/08-latihan-refactor-book.mdx`
- [ ] 5.4.14 [OPS] Tag demo `m03-final`
- [ ] 5.4.15 [FE] Pasang `Prerequisite` di pelajaran 01 yang menunjuk seluruh pelajaran Modul 02
- [ ] 5.4.17 [FE] Tambah **Final Complete Service** (`app/Services/ProductService.php`) di pelajaran 02
- [ ] 5.4.18 [FE] Tambah **Final Complete Controller (tipis)** (`ProductController.php` versi service) di pelajaran 03, berdampingan dengan versi lama lewat `BeforeAfter`
- [ ] 5.4.19 [FE] Tambah **Final Complete Test** (`tests/Feature/ProductTest.php`) di pelajaran 05
- [ ] 5.4.20 [OPS] Cocokkan blok final Modul 03 dengan file di tag demo (`diff`) sebelum publish
- [ ] 5.4.21 [FE] Review akurasi Modul 03 (DI container, service pattern, testing) terhadap dokumentasi Laravel 13

### 5.5 Modul pasca-MVP (stub)
- [ ] 5.5.1 [FE] Tambah entri modul 04–08 di `_modules.ts` dengan status `coming-soon`
- [ ] 5.5.2 [FE] Tampilkan kartu "Segera hadir" di daftar modul (tanpa halaman pelajaran)

## Fase 6 — SEO, Performa, Aksesibilitas & Rilis

### 6.1 SEO
- [ ] 6.1.1 [BE] `app/sitemap.ts` (`force-static`) mencakup semua pelajaran
- [ ] 6.1.2 [BE] `app/robots.ts` (`force-static`)
- [ ] 6.1.3 [BE] `app/opengraph-image.tsx` / gambar OG statis per modul
- [ ] 6.1.4 [FE] JSON-LD `Course` di daftar modul dan `TechArticle` di pelajaran
- [ ] 6.1.5 [FE] Metadata root: `metadataBase`, title template, ikon, manifest
- [ ] 6.1.6 [OPS] Daftarkan situs di Google Search Console dan kirim sitemap

### 6.2 Performa
- [ ] 6.2.1 [FE] Audit ukuran bundle (`@next/bundle-analyzer`), pastikan < 150 KB gzip halaman pelajaran
- [ ] 6.2.2 [FE] Pastikan Pagefind, giscus, Motion berat dimuat dinamis
- [ ] 6.2.3 [OPS] Tambah Lighthouse CI di workflow untuk preview deployment
- [ ] 6.2.4 [OPS] Atur ambang batas Lighthouse (Performance ≥ 90, A11y 100, SEO ≥ 95)

### 6.3 Aksesibilitas & QA
- [ ] 6.3.1 [FE] Audit axe pada landing, daftar modul, halaman pelajaran, dialog pencarian
- [ ] 6.3.2 [FE] Uji navigasi keyboard penuh (header, sidebar, tab, dialog)
- [ ] 6.3.3 [FE] Uji tampilan 360 px (blok kode, tabel, FileTree, BeforeAfter)
- [ ] 6.3.4 [FE] Uji mode gelap seluruh komponen MDX
- [ ] 6.3.5 [FE] Uji alur progres: tandai selesai → reload → resume → reset
- [ ] 6.3.6 [FE] Uji alur Next Step Modul 02 → 03 dengan dan tanpa progres lengkap
- [ ] 6.3.7 [OPS] Uji pencarian pada build produksi (query: "route model binding", "sweetalert", "View not found")

### 6.4 Analitik & privasi
- [ ] 6.4.1 [OPS] Aktifkan Vercel Web Analytics (kuota Hobby 50 rb event/bulan)
- [ ] 6.4.2 [FE] Pasang `<Analytics />` hanya di produksi
- [ ] 6.4.3 [FE] Tulis bagian privasi di `/tentang` (localStorage, GitHub/giscus, Vercel Analytics)

### 6.5 Dokumentasi & komunitas
- [ ] 6.5.1 [OPS] `README.md`: deskripsi, cara jalan, struktur, cara tambah pelajaran
- [ ] 6.5.2 [OPS] `CONTRIBUTING.md`: format frontmatter, aturan kode (harus diuji di repo demo)
- [ ] 6.5.3 [OPS] `.github/PULL_REQUEST_TEMPLATE.md` dengan checklist konten
- [ ] 6.5.4 [OPS] `.github/ISSUE_TEMPLATE/typo-or-error.yml`
- [ ] 6.5.5 [OPS] `LICENSE` (kode) dan `CONTENT_LICENSE.md` (konten)
- [ ] 6.5.6 [OPS] Template `docs/content-template.mdx` untuk pelajaran baru

### 6.6 Rilis
- [ ] 6.6.1 [OPS] Checklist pra-rilis: semua pelajaran Modul 01–03 `lastVerified` terisi, tautan lolos, CI hijau
- [ ] 6.6.2 [OPS] Deploy produksi di Vercel (branch `main`)
- [ ] 6.6.3 [OPS] (Opsional) Domain kustom + DNS
- [ ] 6.6.4 [OPS] Smoke test produksi: landing, satu pelajaran per modul, pencarian, komentar, 404
- [ ] 6.6.5 [OPS] Umumkan rilis (konten sosial @bahas.claude) dan catat metrik baseline

## Fase 7 — Backlog Pasca-MVP ("dan lain-lain")

- [ ] 7.1.1 [FE] Modul 04 Eloquent Relationships (outline + pelajaran)
- [ ] 7.1.2 [FE] Modul 05 Autentikasi dengan starter kit Laravel 13
- [ ] 7.1.3 [FE] Modul 06 API Resource & REST API
- [ ] 7.1.4 [FE] Modul 07 Testing dengan Pest/PHPUnit
- [ ] 7.1.5 [FE] Modul 08 Deploy aplikasi Laravel
- [ ] 7.2.1 [FE] Quiz per modul (ditunda dari MVP)
- [ ] 7.2.2 [AI] Asisten tanya-jawab berbasis konten (evaluasi: Gemini/OpenRouter via Route Handler; butuh keluar dari static export)
- [ ] 7.2.3 [OPS] Evaluasi pindah host jika monetisasi (Vercel Pro / Cloudflare Pages)

---

## Risiko & Mitigasi

| Risiko | Dampak | Mitigasi |
|---|---|---|
| TypeScript 7 / Tailwind / Next 16.x belum kompatibel penuh | Build gagal | Spike 0.1.2; fallback TypeScript 5.x, kunci versi di lockfile |
| Pagefind tidak ter-serve pada Vercel dengan static export | Pencarian mati | Spike 0.1.6; fallback indeks Fuse.js (JSON statis) |
| Opsi plugin MDX non-serializable di Turbopack | Highlighter tidak jalan | Spike 0.1.4; pakai `@shikijs/rehype` dengan opsi serializable atau komponen `CodeBlock` berbasis Shiki di sisi server |
| Kode tutorial salah/usang saat Laravel rilis minor | Merusak kepercayaan pembaca | Frontmatter `laravelVersion` + `lastVerified`, repo demo bertag, CI cek tautan, audit tiap rilis minor |
| `sweetalert2/laravel` belum mendukung versi Laravel tertentu | Tutorial SweetAlert gagal | Spike 0.1.9; fallback ke SweetAlert2 murni via `window.Swal` + flash session manual |
| Melanggar syarat Vercel Hobby (komersial) | Akun ditangguhkan | Larangan iklan/afiliasi di Out of Scope; rencana pindah host (7.2.3) |
| Progres hilang saat pembaca membersihkan data browser | Frustrasi ringan | Dijelaskan di halaman Tentang; ekspor/impor progres kandidat pasca-MVP |
| giscus gagal dimuat (repo privat/Discussions mati) | Komentar tidak ada | Verifikasi 4.4.5; pesan fallback 4.4.4 |

## Definition of Done (Epic)

- Seluruh task Fase 0–6 dicentang; CI hijau; deployment produksi aktif di Vercel Hobby.
- Modul 01–03 terbit, setiap blok kode inti terbukti jalan di repo demo (tag tersedia).
- Alur J1–J6 lulus uji manual; Lighthouse dan axe memenuhi ambang batas.
- Dokumentasi kontributor lengkap dan template pelajaran siap dipakai.