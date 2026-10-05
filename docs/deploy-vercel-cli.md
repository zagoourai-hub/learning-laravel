# Tutorial: Push ke GitHub dan Deploy ke Vercel lewat CLI

Panduan ini ditulis dari langkah yang benar-benar dipakai untuk situs Laravel Belajar (Next.js 16, static export). Semua perintah dijalankan dari folder project.

> Web tutorial ini dibuat oleh zagoours

## Alur singkat

```
edit kode → git add + commit → git push → vercel deploy (preview) → cek → vercel deploy --prod
```

## 1. Persiapan (sekali saja)

### 1.1 Pasang Vercel CLI

```bash
npm i -g vercel
vercel --version
```

### 1.2 Login

```bash
vercel login
vercel whoami
```

`vercel login` membuka browser untuk konfirmasi. `vercel whoami` menampilkan akun yang sedang aktif. Pastikan akunnya benar sebelum deploy.

### 1.3 Atur identitas git (khusus repo ini)

```bash
git config user.name "zagoours"
git config user.email "email-kamu@contoh.com"
```

Tanpa `--global`, setting ini hanya berlaku di repo ini.

### 1.4 Sambungkan remote GitHub

Buat repo kosong di github.com (tanpa README supaya tidak bentrok), lalu:

```bash
git remote add origin https://github.com/<username>/<nama-repo>.git
git remote -v
```

## 2. Push ke GitHub

```bash
git status
git add -A
git commit -m "feat: deskripsi singkat perubahan"
git push -u origin main
```

- `-u` hanya perlu di push pertama. Setelah itu cukup `git push`.
- Kalau muncul peringatan `LF will be replaced by CRLF` di Windows, itu normal dan tidak menggagalkan commit.
- Jangan pakai `git push --force` kecuali kamu benar-benar paham akibatnya: riwayat di GitHub akan tertimpa.
- Cek `git status` sebelum `git add -A`. File rahasia (`.env`) dan hasil build (`out/`, `.next/`) tidak boleh ikut. Keduanya sudah ada di `.gitignore`.

## 3. Deploy ke Vercel

### 3.1 Deploy pertama (preview)

```bash
vercel deploy --yes
```

Pada deploy pertama, `--yes` menghubungkan folder ini ke project Vercel baru dan membuat folder `.vercel/` secara otomatis. Hasilnya URL preview, misalnya:

```
Preview   https://nama-project-abc123-akunmu.vercel.app
```

Framework Next.js terdeteksi otomatis. Untuk situs ini tidak ada environment variable yang wajib diisi.

### 3.2 Cek preview

Preview Vercel dilindungi login secara default, jadi `curl` biasa akan ditolak. Pakai:

```bash
vercel curl https://nama-project-abc123-akunmu.vercel.app/ -- -s -o /dev/null -w "%{http_code}\n"
```

Hasil `200` berarti halaman terbit. Cek juga halaman penting lain, misalnya `/belajar/` dan `/sitemap.xml`.

Lihat status deployment:

```bash
vercel inspect nama-project-abc123-akunmu.vercel.app
```

Status yang diharapkan adalah `Ready`.

### 3.3 Deploy ke produksi

Setelah preview aman:

```bash
vercel deploy --prod
```

Ini mempublikasikan situs ke domain produksi. Lakukan hanya kalau kamu memang ingin situs bisa dibuka publik.

## 4. Environment variable (opsional)

Untuk mengaktifkan komentar giscus atau mengatur URL situs:

```bash
vercel env add NEXT_PUBLIC_SITE_URL production
vercel env ls
vercel env pull .env.local
```

Setelah menambah variabel, deploy ulang (`vercel deploy --prod`) karena nilai `NEXT_PUBLIC_*` ikut tertanam saat build.

## 5. Perintah yang sering dipakai

| Perintah | Fungsi |
|---|---|
| `vercel ls` | daftar deployment |
| `vercel logs <url>` | log deployment |
| `vercel inspect <url>` | detail dan status deployment |
| `vercel rollback` | kembali ke deployment produksi sebelumnya |
| `vercel link` | sambungkan folder ke project yang sudah ada |
| `vercel remove <nama-project>` | hapus project |

## 6. Masalah yang sering muncul

| Gejala | Penyebab | Solusi |
|---|---|---|
| `vercel curl` / `curl` ke preview mengembalikan 401 atau halaman login | Deployment Protection aktif | Pakai `vercel curl`, bukan `curl` |
| Error `invalid-route-source-pattern` saat deploy | pola `source` di `vercel.json` tidak valid, misalnya `/path/?` | Pakai dua aturan terpisah: `/path` dan `/path/` |
| Build gagal menarik font dari `fonts.gstatic.com` (timeout) | koneksi ke Google Fonts diblokir | Pakai font self-host (`@fontsource-variable/*` dengan `next/font/local`) |
| `git push` ditolak: `fetch first` / `non-fast-forward` | remote punya commit yang belum ada di lokal | `git pull --rebase origin main`, lalu `git push` |
| Push minta login terus-menerus | kredensial GitHub belum tersimpan | Login lewat Git Credential Manager, atau pakai Personal Access Token |
| Deploy berhasil tapi gambar OG bertipe salah | header `Content-Type` belum diatur | Tambah aturan header di `vercel.json` untuk `/opengraph-image` dan `/opengraph-image/` |
| Situs masih menampilkan versi lama | cache atau deploy belum dipromosikan ke produksi | Pastikan memakai `--prod`, lalu refresh keras (Ctrl+F5) |

## 7. Alternatif: deploy otomatis lewat GitHub

Kalau repo sudah dihubungkan ke Vercel (vercel.com/new → pilih repo), setiap `git push` ke `main` otomatis menjadi deployment produksi, dan setiap pull request mendapat URL preview sendiri. Dengan cara ini kamu tidak perlu menjalankan `vercel deploy` manual.

## Checklist sebelum deploy produksi

- [ ] `pnpm build` lolos di komputermu
- [ ] `git status` bersih dan sudah `git push`
- [ ] Preview sudah dicek dengan `vercel curl` (status 200)
- [ ] Tidak ada file rahasia di repo
- [ ] Kamu memang ingin situs ini dipublikasikan
