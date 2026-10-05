import type { ModuleMeta } from "@/lib/types";

export const modules: ModuleMeta[] = [
  {
    id: "01-persiapan",
    title: "Persiapan",
    description:
      "Roadmap belajar, instalasi PHP + Composer + Laravel 13, struktur folder, dan routing dasar.",
    level: "pemula",
    order: 1,
    status: "coming-soon",
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
      "Refactor controller gemuk ke ProductService, controller tipis dengan constructor DI, dan testing service.",
    level: "menengah",
    order: 3,
    status: "coming-soon",
  },
  {
    id: "04-eloquent-relationships",
    title: "Eloquent Relationships",
    description: "Relasi one-to-many, many-to-many, dan eager loading di Eloquent.",
    level: "menengah",
    order: 4,
    status: "coming-soon",
  },
  {
    id: "05-autentikasi",
    title: "Autentikasi",
    description: "Login, registrasi, dan proteksi route memakai starter kit Laravel 13.",
    level: "menengah",
    order: 5,
    status: "coming-soon",
  },
  {
    id: "06-api-resource",
    title: "API Resource & REST",
    description: "Membangun REST API dengan API Resource dan route api.",
    level: "menengah",
    order: 6,
    status: "coming-soon",
  },
  {
    id: "07-testing",
    title: "Testing",
    description: "Menulis feature test dan unit test dengan Pest/PHPUnit.",
    level: "menengah",
    order: 7,
    status: "coming-soon",
  },
  {
    id: "08-deploy",
    title: "Deploy Laravel",
    description: "Menyiapkan dan men-deploy aplikasi Laravel ke server produksi.",
    level: "menengah",
    order: 8,
    status: "coming-soon",
  },
];
