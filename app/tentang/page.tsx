import type { Metadata } from "next";
import Link from "next/link";
import { ResetProgressButton } from "@/components/learn/reset-progress-button";

export const metadata: Metadata = {
  title: "Tentang & Kontribusi",
  description: "Tentang Laravel Belajar, lisensi, privasi, dan cara berkontribusi.",
  alternates: { canonical: "/tentang/" },
};

export default function TentangPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:py-16">
      <h1 className="font-heading text-3xl sm:text-4xl">Tentang & Kontribusi</h1>

      <div className="prose mt-8">
        <p>
          Laravel Belajar adalah tutorial Laravel 13 berbahasa Indonesia yang disusun sebagai jalur belajar berurutan:
          mulai dari CRUD Product dengan semua logic di controller, lalu refactor ke Service Pattern. Situs ini statis,
          tanpa database dan tanpa akun.
        </p>

        <h2 id="lisensi">Lisensi</h2>
        <ul>
          <li>
            Kode situs dan contoh kode: <strong>MIT</strong>.
          </li>
          <li>
            Teks tutorial: <strong>CC BY-NC-SA 4.0</strong>. Boleh dibagikan dan diadaptasi untuk tujuan non-komersial
            dengan menyebut sumber dan memakai lisensi yang sama.
          </li>
        </ul>

        <h2 id="privasi">Privasi</h2>
        <p>
          Progres belajar (pelajaran yang ditandai selesai dan halaman terakhir yang dibuka) hanya disimpan di
          localStorage browser kamu. Tidak ada akun, tidak ada cookie pelacak, dan data tersebut tidak pernah dikirim ke
          server. Membersihkan data browser akan menghapus progres.
        </p>

        <h2 id="kontribusi">Lapor kesalahan & tambah pelajaran</h2>
        <ul>
          <li>Menemukan typo atau kode yang tidak jalan? Buka issue di repositori GitHub proyek ini.</li>
          <li>
            Pelajaran ditulis sebagai file MDX di <code>content/laravel-13/&lt;modul&gt;/&lt;pelajaran&gt;.mdx</code>{" "}
            dengan frontmatter yang divalidasi saat build. Panduan lengkapnya ada di README repositori.
          </li>
          <li>Setiap blok kode harus sudah dijalankan di proyek Laravel 13 sebelum diajukan.</li>
        </ul>

        <h2 id="reset">Reset progres</h2>
        <p>Hapus semua tanda selesai dan riwayat halaman terakhir di perangkat ini.</p>
      </div>

      <div className="mt-6">
        <ResetProgressButton />
      </div>

      <p className="mt-12 text-sm text-muted">
        <Link href="/belajar/" className="font-semibold text-accent hover:underline">
          ← Kembali ke jalur belajar
        </Link>
      </p>
    </div>
  );
}
