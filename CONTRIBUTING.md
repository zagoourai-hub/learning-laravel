# Berkontribusi ke Laravel Belajar

Terima kasih sudah mau membantu! Kontribusi paling berguna: laporan typo/error dan perbaikan isi pelajaran.

## Melapor typo atau error

Buka [GitHub Issues](https://github.com/zagoourai-hub/learning-laravel/issues) dan sertakan:

- URL halaman pelajaran (dan heading terdekat),
- apa yang salah (teks, kode, perintah) dan apa yang seharusnya,
- kalau kode gagal dijalankan: pesan error lengkap, versi PHP, dan versi Laravel.

## Menambah atau mengubah pelajaran

1. Baca [`docs/content-guide.md`](docs/content-guide.md) — kontrak gaya, frontmatter, dan aturan MDX.
2. Salin [`docs/content-template.mdx`](docs/content-template.mdx) ke `content/laravel-13/<modul>/<NN-slug>.mdx`, lalu isi frontmatter dan isinya.
3. Jalankan:

   ```bash
   pnpm check:content   # cek sintaks MDX cepat
   pnpm build           # validasi frontmatter + referensi, lalu build statis
   ```

4. Cek tampilannya dengan `pnpm dev`.

## Aturan kode

- **Kode CRUD Product** (model, migration, `ProductController`, Form Request, view Blade, route) harus **persis** mengikuti [`docs/tutorial-laravel.md`](docs/tutorial-laravel.md). Kalau pelajaranmu mengubah file CRUD, mulai dari versi di dokumen itu dan ubah hanya bagian yang dibahas.
- Fakta, perintah Artisan, dan API lain harus sesuai dokumentasi resmi Laravel 13.x. Jangan menulis API yang tidak ada di dokumentasi.
- Setiap file yang diubah ditutup dengan pola "Here's your complete `path`:" diikuti file lengkap.

## Pull request

- Satu PR untuk satu topik (satu pelajaran atau satu perbaikan).
- Judul jelas, mis. `content(03): perbaiki contoh ProductService::update`.
- Pastikan `pnpm check:content` dan `pnpm build` lolos; CI menjalankan keduanya beserta type check.
- Jelaskan di deskripsi apa yang diubah dan sumber dokumentasi yang dipakai.

Dengan berkontribusi, kamu setuju kode dilisensikan MIT ([`LICENSE`](LICENSE)) dan konten CC BY-NC-SA 4.0 ([`CONTENT_LICENSE.md`](CONTENT_LICENSE.md)).
