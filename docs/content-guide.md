# Panduan Konten Laravel Belajar

Kontrak untuk semua penulis pelajaran. Contoh acuan: `content/laravel-13/02-crud-pemula/01-crud-full-controller.mdx`.

## Sumber

- Semua fakta, perintah Artisan, nama class/method, dan potongan kode diambil dari dokumentasi resmi Laravel 13.x lewat Context7 (`resolve-library-id` lalu `query-docs`, library dokumentasi Laravel). Jangan menulis API yang tidak dikonfirmasi dokumentasi. Kalau dokumentasi tidak membahasnya, jangan ditulis.
- **Pengecualian: kode CRUD Product** (model, migration, `ProductController`, Form Request, view Blade, route) selalu diambil **persis** dari dokumen penulis `docs/tutorial-laravel.md`, bukan dari Context7. Kalau sebuah pelajaran mengubah file CRUD, mulai dari versi dokumen itu dan ubah hanya bagian yang dibahas. Pertahankan gaya, pesan Indonesia, dan class Tailwind yang sama.

## Contoh berjalan

Proyek `laravel13-crud` dari Modul 02: model `Product` (`name`, `description`, `price` decimal 12,2, `stock` unsigned int), `ProductController` resource full controller, `StoreProductRequest`/`UpdateProductRequest`, view Blade `products.*`, route `Route::resource('products', ...)`, SQLite.

- Modul 03 me-refactor kode akhir Modul 02 ke `App\Services\ProductService`.
- Modul 04–08 masing-masing berangkat dari kode akhir Modul 02 (tidak bergantung satu sama lain).
- Modul 01 belum punya proyek; ia menyiapkan instalasi sampai `composer run dev` dan routing dasar.

## File & frontmatter

Lokasi: `content/laravel-13/<module>/<NN-slug>.mdx` (slug huruf kecil, kata dipisah `-`, diawali nomor urut dua digit).

```yaml
---
title: "Judul Pelajaran"
description: "Satu kalimat konkret tentang apa yang dibangun/dipelajari."
module: "<nama folder modul>"
order: 1                      # unik dalam modul, sama dengan nomor file
level: "pemula"               # atau "menengah"
laravelVersion: "13.x"
lastVerified: "2026-10-05"
estimatedMinutes: 15
tags: ["routing", "artisan"]
prerequisites: ["<module>/<slug>"]   # opsional; harus menunjuk pelajaran yang ada
nextStep: "<module>/<slug>"          # opsional; hanya ke pelajaran di modul yang sama
---
```

Build gagal kalau frontmatter tidak valid atau referensi menunjuk pelajaran yang tidak ada. Perpindahan antar-modul ditangani `nextModule` di `_modules.ts` (bukan oleh penulis).

## Struktur pelajaran

1. Tanpa `# H1` (judul dirender dari frontmatter). Mulai dengan paragraf pembuka: apa yang dibangun dan kenapa.
2. Heading `##` untuk langkah (`## Langkah 1 — ...`), `###` untuk sub-bagian.
3. Alur: penjelasan → potongan kode kecil per langkah → **Final Complete File** → cara menguji → error umum.
4. Final Complete File: untuk setiap file yang diubah, tulis kalimat persis `Here's your complete \`path/ke/file.php\`:` lalu satu fence berisi file **lengkap** dengan meta title:

   ````md
   Here's your complete `app/Services/ProductService.php`:

   ```php title="app/Services/ProductService.php"
   <?php
   ...seluruh isi file...
   ```
   ````

   Untuk bagian final controller pakai heading `### Final Complete Controller` (atau `### Final Complete <Nama>`).
5. Perintah terminal di fence `bash` tanpa prompt `$`.
6. Callout = blockquote: `> **Penting:** ...`, `> **Tips:** ...`, `> **Jebakan umum:** ...`.
7. Tabel GFM boleh (misalnya tabel "Gejala | Penyebab | Solusi"). Akhiri dengan `## Cek pemahamanmu` (task list `- [ ]`) bila cocok.
8. Bahasa Indonesia yang lugas dan bersahabat ("kamu"), istilah teknis tetap bahasa Inggris (controller, route, migration). Jelaskan *kenapa*, bukan hanya *apa*.

## Aturan MDX (wajib, kalau dilanggar build gagal)

- Di luar fence/inline code, jangan tulis `{`, `}`, `<`, `>` mentah. Bungkus dengan inline code: `` `{product}` ``, `` `<form>` ``.
- Jangan pakai komponen JSX; hanya Markdown + GFM.
- Bahasa fence yang didukung: `php`, `blade`, `bash`, `shell`, `js`, `ts`, `json`, `ini`, `sql`, `html`, `yaml`, `text`.
