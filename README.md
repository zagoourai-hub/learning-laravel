# Laravel Belajar

Situs tutorial Laravel 13 berbahasa Indonesia: mulai dari CRUD "full controller" untuk pemula, lalu lanjut ke Service Pattern. Dibangun dengan Next.js 16 (App Router, TypeScript), konten MDX di repo, tanpa database, dan diekspor statis sehingga bisa di-hosting gratis di Vercel Hobby.

Rencana lengkap ada di [`docs/PRD.md`](docs/PRD.md).

## Prasyarat

- Node.js (versi LTS terbaru)
- pnpm (versi dikunci lewat `packageManager` di `package.json`)

## Perintah

```bash
pnpm install         # pasang dependensi
pnpm dev             # server pengembangan di http://localhost:3000
pnpm check:content   # cek sintaks MDX semua pelajaran (cepat, tanpa build)
pnpm typecheck       # next typegen + tsc --noEmit
pnpm build           # build statis ke folder out/ (juga memvalidasi frontmatter)
```

`pnpm build` menghasilkan situs statis lengkap di `out/` (`output: "export"`). Folder itu bisa disajikan oleh host statis mana pun.

`pnpm lint` saat ini gagal karena typescript-eslint belum mendukung TypeScript 7, jadi tidak dijalankan di CI.

## CI

GitHub Actions (`.github/workflows/ci.yml`) berjalan di setiap push dan pull request ke `main`: `pnpm install --frozen-lockfile`, `pnpm check:content`, `pnpm typecheck`, lalu `pnpm build`. Dependabot memperbarui dependensi npm dan GitHub Actions setiap minggu.

Panduan kontribusi ada di [`CONTRIBUTING.md`](CONTRIBUTING.md); template pelajaran baru di [`docs/content-template.mdx`](docs/content-template.mdx).

## Menambah pelajaran

1. Buat file `content/laravel-13/<modul>/<slug>.mdx`, misalnya `content/laravel-13/02-crud-pemula/02-migration-model.mdx`. Folder modul harus terdaftar di `content/laravel-13/_modules.ts`. Ubah `status` modul menjadi `"published"` saat pelajarannya siap.
2. Isi frontmatter:

   ```yaml
   ---
   title: "Controller Resource & CRUD Product"
   description: "Membuat resource controller dan seluruh method CRUD untuk Product."
   module: "02-crud-pemula"        # harus sama dengan nama folder
   order: 3                        # unik dalam satu modul, menentukan urutan
   level: "pemula"                 # pemula | menengah
   laravelVersion: "13.x"
   lastVerified: "2026-10-05"      # YYYY-MM-DD, pakai tanda kutip
   estimatedMinutes: 15
   tags: ["controller", "crud"]
   prerequisites: ["02-crud-pemula/02-migration-model"]  # opsional
   nextStep: "02-crud-pemula/04-layout-index"           # opsional
   ---
   ```

3. Jangan tulis judul `# H1` di isi file, karena judul dirender dari `title`.
4. Untuk file kode final, ikuti pola "Final Complete File": tulis kalimat pengantar dengan path sebagai inline code, lalu satu blok kode lengkap dengan `title`:

   ````mdx
   Here's your complete `app/Http/Controllers/ProductController.php`:

   ```php title="app/Http/Controllers/ProductController.php"
   <?php
   // ... seluruh isi file ...
   ```
   ````

   Blok kode otomatis mendapat syntax highlighting, label nama file, dan tombol salin.

**Build gagal** jika frontmatter tidak valid, jika `module` tidak sama dengan nama folder, jika `order` bentrok, atau jika `prerequisites`/`nextStep` menunjuk pelajaran yang tidak ada. Pesan error menyebut file dan field yang salah.

Karena ini MDX, karakter `{`, `}`, dan `<` di luar blok kode atau inline code dibaca sebagai JSX. Escape karakter tersebut (`\{`) atau bungkus dengan backtick.

## Pencarian

Indeks pencarian dibuat saat build sebagai file statis `/search-index.json` (judul pelajaran, heading, dan teks per seksi), lalu dimuat oleh dialog pencarian (`Ctrl/⌘ + K`) ketika dibuka. Pencarian ini juga berjalan di `pnpm dev`.

## Deploy ke Vercel (Hobby, gratis)

1. Push repo ke GitHub.
2. Di Vercel: **Add New → Project → Import** repo ini. Framework terdeteksi sebagai Next.js, jadi tidak ada pengaturan build yang perlu diubah.
3. Tidak ada environment variable wajib. URL produksi otomatis dipakai untuk sitemap dan metadata. Isi `NEXT_PUBLIC_SITE_URL` (mis. `https://domain-kamu.com`) hanya jika memakai domain kustom.

Security headers diatur di `vercel.json`. Vercel Hobby khusus untuk penggunaan non-komersial, jadi jangan pasang iklan atau link afiliasi.

## Komentar (giscus)

Komentar per pelajaran memakai [giscus](https://giscus.app) (GitHub Discussions). Tanpa konfigurasi, bagian komentar hanya menampilkan pesan bahwa komentar belum aktif.

1. Di repo [zagoourai-hub/learning-laravel](https://github.com/zagoourai-hub/learning-laravel): **Settings → General → Features → Discussions** (centang). Repo harus publik.
2. Pasang aplikasi giscus: https://github.com/apps/giscus → pilih repo ini.
3. Buka https://giscus.app, isi repo `zagoourai-hub/learning-laravel`, pilih kategori Discussions (mis. *Announcements*), lalu salin nilai `data-repo-id` dan `data-category-id`.
4. Di Vercel: **Project → Settings → Environment Variables**, isi untuk **Production** dan **Preview** (lihat [`.env.example`](.env.example)):
   - `NEXT_PUBLIC_GISCUS_REPO` = `zagoourai-hub/learning-laravel`
   - `NEXT_PUBLIC_GISCUS_REPO_ID`
   - `NEXT_PUBLIC_GISCUS_CATEGORY`
   - `NEXT_PUBLIC_GISCUS_CATEGORY_ID`
5. **Redeploy**, karena variabel `NEXT_PUBLIC_*` ditanam saat build.

## Lisensi

Kode: [MIT](LICENSE). Konten tutorial: [CC BY-NC-SA 4.0](CONTENT_LICENSE.md). Web tutorial ini dibuat oleh zagoours.
