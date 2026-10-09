import type { ModuleMeta } from "@/lib/types";

export const modules: ModuleMeta[] = [
  {
    id: "01-persiapan",
    title: "Persiapan",
    description:
      "Roadmap belajar dan apa itu Laravel, instalasi PHP + Composer + Laravel 13, struktur folder proyek, dan routing dasar dengan php artisan route:list.",
    level: "pemula",
    order: 1,
    status: "published",
    nextModule: "02-crud-pemula",
  },
  {
    id: "02-crud-pemula",
    title: "CRUD Pemula (Full Controller)",
    description:
      "Bangun CRUD Product lengkap: migration, model, resource controller, Form Request, Blade, dan pagination.",
    level: "pemula",
    order: 2,
    status: "published",
    nextModule: "03-service-pattern",
  },
  {
    id: "03-service-pattern",
    title: "Next Step: Service Pattern",
    description:
      "Kenapa controller gemuk bermasalah, membuat ProductService, controller tipis dengan constructor injection, testing, alternatif Action/DTO, dan kapan service benar-benar perlu.",
    level: "menengah",
    order: 3,
    status: "published",
    nextModule: "04-eloquent-relationships",
  },
  {
    id: "04-eloquent-relationships",
    title: "Eloquent Relationships",
    description:
      "Relasi one-to-many (Category) dan many-to-many (Tag), eager loading untuk mengatasi masalah N+1, plus latihan filter, hitung, dan CRUD kategori.",
    level: "menengah",
    order: 4,
    status: "published",
    nextModule: "05-autentikasi",
  },
  {
    id: "05-autentikasi",
    title: "Autentikasi",
    description:
      "Starter kit Laravel 13, register/login/logout manual, melindungi route dengan middleware auth, produk milik user, dan authorization dengan ProductPolicy.",
    level: "menengah",
    order: 5,
    status: "published",
    nextModule: "06-api-resource",
  },
  {
    id: "06-api-resource",
    title: "API Resource & REST",
    description:
      "Menyiapkan API routes dengan install:api, API controller, ProductResource, validasi dan status code JSON, lalu autentikasi token dengan Sanctum.",
    level: "menengah",
    order: 6,
    status: "published",
    nextModule: "07-testing",
  },
  {
    id: "07-testing",
    title: "Testing",
    description:
      "Dasar testing di Laravel 13, ProductFactory, feature test CRUD Product, test validasi Form Request, dan tips menjalankan test.",
    level: "menengah",
    order: 7,
    status: "published",
    nextModule: "08-deploy",
  },
  {
    id: "08-deploy",
    title: "Deploy Laravel",
    description:
      "Persiapan produksi (.env, debug mode), optimasi cache dan build Vite, database produksi, memilih tempat deploy, serta checklist dan troubleshooting.",
    level: "menengah",
    order: 8,
    status: "published",
    nextModule: "09-react-starter-kit",
  },
  {
    id: "09-react-starter-kit",
    title: "React Starter Kit: Auth & CRUD",
    description:
      "Laravel 13 React Starter Kit (Inertia, shadcn/ui, Wayfinder, Fortify): cara kerja auth, verifikasi email (mati, link, kode OTP), dan CRUD Task lengkap dengan testing.",
    level: "menengah",
    order: 9,
    status: "published",
    nextModule: "10-flash-toast-auth-crud",
  },
  {
    id: "10-flash-toast-auth-crud",
    title: "Flash Toast, Auth & CRUD",
    description:
      "Notifikasi sukses dan gagal dengan Inertia::flash dan toast Sonner untuk CRUD products serta login, register, logout, lengkap dengan bahasa Indonesia dan validasi.",
    level: "menengah",
    order: 10,
    status: "published",
  },
];
