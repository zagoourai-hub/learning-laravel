---
title: "CRUD Laravel 13 untuk Pemula: Full Controller"
description: "Bangun CRUD Product lengkap di Laravel 13: migration, model, resource controller, StoreProductRequest, UpdateProductRequest, Blade + Tailwind, pagination, dan pesan sukses."
module: "02-crud-pemula"
level: "pemula"
laravelVersion: "13.x"
lastVerified: "2026-10-05"
estimatedMinutes: 60
tags: ["crud", "controller", "form-request", "blade", "tailwind"]
nextStep: "03-service-pattern/01-kenapa-controller-gemuk"
---

# CRUD Laravel 13 untuk Pemula: Full Controller

Di tutorial ini kamu membangun **manajemen produk** (Create, Read, Update, Delete) dari nol. Semua logic sengaja ditaruh di **controller** dulu, supaya alurnya mudah dipahami. Setelah paham, lanjut ke halaman berikutnya: **Service Pattern** (memindahkan logic keluar dari controller).

## Yang akan kamu buat

- Daftar produk dengan pagination (10 data per halaman)
- Form tambah dan edit produk dengan validasi + pesan error
- Halaman detail produk
- Hapus produk dengan konfirmasi
- Pesan sukses setelah tambah/ubah/hapus

## Prasyarat

- PHP 8.3 atau lebih baru, Composer, dan Node.js
- Laravel installer (`composer global require laravel/installer`) atau cukup Composer
- Editor kode (VS Code) dan terminal

> Laravel 13 memakai **SQLite** secara default, jadi kamu tidak perlu menginstal MySQL untuk mengikuti tutorial ini. Kalau mau MySQL, ubah `DB_*` di `.env` (lihat bagian Catatan di akhir).

---

## Langkah 1 — Buat proyek Laravel 13

Pilih salah satu:

```bash
laravel new laravel13-crud
```

atau tanpa installer:

```bash
composer create-project laravel/laravel laravel13-crud
```

Masuk ke folder proyek dan jalankan semuanya sekaligus (server, queue, dan Vite):

```bash
cd laravel13-crud
composer run dev
```

Buka `http://localhost:8000`. Kalau halaman welcome Laravel muncul, instalasi berhasil. Biarkan terminal ini tetap menyala; kita akan membuka terminal kedua untuk perintah `artisan`.

---

## Langkah 2 — Buat model dan migration

```bash
php artisan make:model Product -m
```

Perintah ini membuat dua file: `app/Models/Product.php` dan file migration di `database/migrations/`.

## Langkah 3 — Tentukan struktur tabel

Buka file migration `..._create_products_table.php` dan isi seperti ini:

Here's your complete `database/migrations/xxxx_xx_xx_xxxxxx_create_products_table.php`:

```php title="database/migrations/xxxx_xx_xx_xxxxxx_create_products_table.php"
<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
            $table->decimal('price', 12, 2);
            $table->unsignedInteger('stock')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
```

Jalankan migration:

```bash
php artisan migrate
```

Kalau Laravel menanyakan apakah file SQLite perlu dibuat, jawab **yes**.

## Langkah 4 — Atur model Product

Model perlu tahu kolom mana yang boleh diisi massal (`$fillable`). Tanpa ini, `Product::create([...])` akan ditolak (mass assignment protection).

Here's your complete `app/Models/Product.php`:

```php title="app/Models/Product.php"
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'description',
        'price',
        'stock',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'stock' => 'integer',
        ];
    }
}
```

`casts()` membuat `price` selalu bertipe desimal dua digit dan `stock` selalu integer saat dibaca dari database.

---

## Langkah 5 — Buat resource controller beserta Form Request

Satu perintah membuat controller lengkap dengan 7 method CRUD **dan** dua Form Request:

```bash
php artisan make:controller ProductController --resource --model=Product --requests
```

File yang dihasilkan:

- `app/Http/Controllers/ProductController.php`
- `app/Http/Requests/StoreProductRequest.php`
- `app/Http/Requests/UpdateProductRequest.php`

> **Penting:** nama class selalu diawali huruf besar (`ProductController`, `StoreProductRequest`). Di Linux, `productController.php` tidak akan ditemukan oleh autoloader.

## Langkah 6 — Daftarkan route

Satu baris `Route::resource` otomatis membuat 7 route CRUD. Kita juga arahkan halaman utama ke daftar produk.

Here's your complete `routes/web.php`:

```php title="routes/web.php"
<?php

use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/products');

Route::resource('products', ProductController::class);
```

Cek hasilnya:

```bash
php artisan route:list --except-vendor
```

| Method | URI | Nama route | Method controller |
|---|---|---|---|
| GET | `/products` | `products.index` | `index` |
| GET | `/products/create` | `products.create` | `create` |
| POST | `/products` | `products.store` | `store` |
| GET | `/products/{product}` | `products.show` | `show` |
| GET | `/products/{product}/edit` | `products.edit` | `edit` |
| PUT/PATCH | `/products/{product}` | `products.update` | `update` |
| DELETE | `/products/{product}` | `products.destroy` | `destroy` |

---

## Langkah 7 — Validasi dengan `StoreProductRequest`

Form Request memisahkan aturan validasi dari controller. Buka `app/Http/Requests/StoreProductRequest.php`:

Here's your complete `app/Http/Requests/StoreProductRequest.php`:

```php title="app/Http/Requests/StoreProductRequest.php"
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama produk wajib diisi.',
            'name.max' => 'Nama produk maksimal 255 karakter.',
            'price.required' => 'Harga wajib diisi.',
            'price.numeric' => 'Harga harus berupa angka.',
            'price.min' => 'Harga tidak boleh negatif.',
            'stock.required' => 'Stok wajib diisi.',
            'stock.integer' => 'Stok harus berupa bilangan bulat.',
            'stock.min' => 'Stok tidak boleh negatif.',
        ];
    }
}
```

> **Jebakan umum:** file yang digenerate Laravel memiliki `authorize()` yang mengembalikan `false`. Kalau tidak kamu ubah menjadi `true`, setiap submit form akan berakhir **403 Forbidden**.

## Langkah 8 — Validasi dengan `UpdateProductRequest`

Aturan untuk edit sama dengan tambah, jadi isinya identik. Memisahkannya tetap berguna: nanti aturan update bisa berbeda (misalnya validasi `unique` yang mengabaikan data yang sedang diedit).

Here's your complete `app/Http/Requests/UpdateProductRequest.php`:

```php title="app/Http/Requests/UpdateProductRequest.php"
<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, array<int, string>>
     */
    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'price' => ['required', 'numeric', 'min:0'],
            'stock' => ['required', 'integer', 'min:0'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Nama produk wajib diisi.',
            'name.max' => 'Nama produk maksimal 255 karakter.',
            'price.required' => 'Harga wajib diisi.',
            'price.numeric' => 'Harga harus berupa angka.',
            'price.min' => 'Harga tidak boleh negatif.',
            'stock.required' => 'Stok wajib diisi.',
            'stock.integer' => 'Stok harus berupa bilangan bulat.',
            'stock.min' => 'Stok tidak boleh negatif.',
        ];
    }
}
```

---

## Langkah 9 — Isi controller (method per method)

Kita isi satu per satu agar jelas fungsi tiap method.

**`index()` — menampilkan daftar produk dengan pagination**

```php
public function index(): View
{
    $products = Product::latest()->paginate(10);

    return view('products.index', compact('products'));
}
```

**`create()` — menampilkan form tambah**

```php
public function create(): View
{
    return view('products.create');
}
```

**`store()` — menyimpan produk baru**

```php
public function store(StoreProductRequest $request): RedirectResponse
{
    Product::create($request->validated());

    return to_route('products.index')
        ->with('success', 'Produk berhasil ditambahkan.');
}
```

`$request->validated()` hanya berisi data yang lolos validasi, jadi aman dipakai untuk `create()`. Perhatikan: method-nya `create`, **bukan** `created`.

**`show()` — menampilkan detail satu produk**

```php
public function show(Product $product): View
{
    return view('products.show', compact('product'));
}
```

`Product $product` diisi otomatis oleh Laravel lewat *route model binding*: nama variabel (`$product`) harus sama dengan parameter route (`{product}`), dan tipe `Product` harus menunjuk ke class model yang benar.

**`edit()` — menampilkan form edit**

```php
public function edit(Product $product): View
{
    return view('products.edit', compact('product'));
}
```

**`update()` — menyimpan perubahan**

```php
public function update(UpdateProductRequest $request, Product $product): RedirectResponse
{
    $product->update($request->validated());

    return to_route('products.index')
        ->with('success', 'Produk berhasil diperbarui.');
}
```

**`destroy()` — menghapus produk**

```php
public function destroy(Product $product): RedirectResponse
{
    $product->delete();

    return to_route('products.index')
        ->with('success', 'Produk berhasil dihapus.');
}
```

### Final Complete Controller

Here's your complete `app/Http/Controllers/ProductController.php`:

```php title="app/Http/Controllers/ProductController.php"
<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreProductRequest;
use App\Http\Requests\UpdateProductRequest;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\View\View;

class ProductController extends Controller
{
    public function index(): View
    {
        $products = Product::latest()->paginate(10);

        return view('products.index', compact('products'));
    }

    public function create(): View
    {
        return view('products.create');
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        Product::create($request->validated());

        return to_route('products.index')
            ->with('success', 'Produk berhasil ditambahkan.');
    }

    public function show(Product $product): View
    {
        return view('products.show', compact('product'));
    }

    public function edit(Product $product): View
    {
        return view('products.edit', compact('product'));
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $product->update($request->validated());

        return to_route('products.index')
            ->with('success', 'Produk berhasil diperbarui.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $product->delete();

        return to_route('products.index')
            ->with('success', 'Produk berhasil dihapus.');
    }
}
```

---

## Langkah 10 — Buat view Blade

Buat folder dan file berikut. Cara cepat dengan artisan:

```bash
php artisan make:view layouts.app
php artisan make:view products.index
php artisan make:view products.create
php artisan make:view products.edit
php artisan make:view products.show
```

> Folder view memakai **jamak** (`products`) dan harus cocok dengan `view('products.index')` di controller. Kalau salah, kamu akan melihat error `View [products.index] not found`.

### Layout utama

Here's your complete `resources/views/layouts/app.blade.php`:

```blade title="resources/views/layouts/app.blade.php"
<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Laravel 13 CRUD')</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="bg-gray-100 text-gray-800">
    <main class="mx-auto max-w-5xl px-4 py-10">
        @if (session('success'))
            <div class="mb-6 rounded-md bg-green-100 px-4 py-3 text-green-800">
                {{ session('success') }}
            </div>
        @endif

        @yield('content')
    </main>
</body>
</html>
```

### Halaman daftar produk

Here's your complete `resources/views/products/index.blade.php`:

```blade title="resources/views/products/index.blade.php"
@extends('layouts.app')

@section('title', 'Daftar Produk')

@section('content')
    <div class="mb-6 flex items-center justify-between">
        <h1 class="text-2xl font-bold">Daftar Produk</h1>
        <a href="{{ route('products.create') }}"
           class="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
            + Tambah Produk
        </a>
    </div>

    <div class="overflow-x-auto rounded-md bg-white shadow">
        <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50 text-left text-sm font-semibold">
                <tr>
                    <th class="px-6 py-3">Nama</th>
                    <th class="px-6 py-3">Harga</th>
                    <th class="px-6 py-3">Stok</th>
                    <th class="px-6 py-3">Aksi</th>
                </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 text-sm">
                @forelse ($products as $product)
                    <tr>
                        <td class="px-6 py-4">{{ $product->name }}</td>
                        <td class="px-6 py-4">Rp {{ number_format($product->price, 0, ',', '.') }}</td>
                        <td class="px-6 py-4">{{ $product->stock }}</td>
                        <td class="px-6 py-4">
                            <a href="{{ route('products.show', $product) }}"
                               class="mr-3 text-gray-600 hover:text-gray-900">Detail</a>
                            <a href="{{ route('products.edit', $product) }}"
                               class="mr-3 text-indigo-600 hover:text-indigo-900">Edit</a>
                            <form action="{{ route('products.destroy', $product) }}"
                                  method="POST"
                                  class="inline"
                                  onsubmit="return confirm('Yakin ingin menghapus produk ini?')">
                                @csrf
                                @method('DELETE')
                                <button type="submit" class="text-red-600 hover:text-red-900">
                                    Hapus
                                </button>
                            </form>
                        </td>
                    </tr>
                @empty
                    <tr>
                        <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                            Belum ada data produk.
                        </td>
                    </tr>
                @endforelse
            </tbody>
        </table>
    </div>

    <div class="mt-6">
        {{ $products->links() }}
    </div>
@endsection
```

### Halaman tambah produk

Here's your complete `resources/views/products/create.blade.php`:

```blade title="resources/views/products/create.blade.php"
@extends('layouts.app')

@section('title', 'Tambah Produk')

@section('content')
    <h1 class="mb-6 text-2xl font-bold">Tambah Produk</h1>

    <form action="{{ route('products.store') }}" method="POST"
          class="space-y-5 rounded-md bg-white p-6 shadow">
        @csrf

        <div>
            <label for="name" class="mb-1 block text-sm font-medium">Nama</label>
            <input type="text" id="name" name="name" value="{{ old('name') }}"
                   class="w-full rounded-md border border-gray-300 px-3 py-2">
            @error('name')
                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="description" class="mb-1 block text-sm font-medium">Deskripsi</label>
            <textarea id="description" name="description" rows="4"
                      class="w-full rounded-md border border-gray-300 px-3 py-2">{{ old('description') }}</textarea>
            @error('description')
                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
            @enderror
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
            <div>
                <label for="price" class="mb-1 block text-sm font-medium">Harga</label>
                <input type="number" step="0.01" id="price" name="price" value="{{ old('price') }}"
                       class="w-full rounded-md border border-gray-300 px-3 py-2">
                @error('price')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label for="stock" class="mb-1 block text-sm font-medium">Stok</label>
                <input type="number" id="stock" name="stock" value="{{ old('stock', 0) }}"
                       class="w-full rounded-md border border-gray-300 px-3 py-2">
                @error('stock')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
        </div>

        <div class="flex gap-3">
            <button type="submit" class="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                Simpan
            </button>
            <a href="{{ route('products.index') }}" class="rounded-md border px-4 py-2 hover:bg-gray-50">
                Batal
            </a>
        </div>
    </form>
@endsection
```

### Halaman edit produk

Bedanya dengan halaman tambah: `action` ke `products.update`, ada `@method('PUT')`, dan nilai awal diambil dari `$product` — `old()` tetap dipakai sebagai prioritas agar input tidak hilang saat validasi gagal.

Here's your complete `resources/views/products/edit.blade.php`:

```blade title="resources/views/products/edit.blade.php"
@extends('layouts.app')

@section('title', 'Edit Produk')

@section('content')
    <h1 class="mb-6 text-2xl font-bold">Edit Produk</h1>

    <form action="{{ route('products.update', $product) }}" method="POST"
          class="space-y-5 rounded-md bg-white p-6 shadow">
        @csrf
        @method('PUT')

        <div>
            <label for="name" class="mb-1 block text-sm font-medium">Nama</label>
            <input type="text" id="name" name="name" value="{{ old('name', $product->name) }}"
                   class="w-full rounded-md border border-gray-300 px-3 py-2">
            @error('name')
                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
            @enderror
        </div>

        <div>
            <label for="description" class="mb-1 block text-sm font-medium">Deskripsi</label>
            <textarea id="description" name="description" rows="4"
                      class="w-full rounded-md border border-gray-300 px-3 py-2">{{ old('description', $product->description) }}</textarea>
            @error('description')
                <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
            @enderror
        </div>

        <div class="grid gap-5 sm:grid-cols-2">
            <div>
                <label for="price" class="mb-1 block text-sm font-medium">Harga</label>
                <input type="number" step="0.01" id="price" name="price" value="{{ old('price', $product->price) }}"
                       class="w-full rounded-md border border-gray-300 px-3 py-2">
                @error('price')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label for="stock" class="mb-1 block text-sm font-medium">Stok</label>
                <input type="number" id="stock" name="stock" value="{{ old('stock', $product->stock) }}"
                       class="w-full rounded-md border border-gray-300 px-3 py-2">
                @error('stock')
                    <p class="mt-1 text-sm text-red-600">{{ $message }}</p>
                @enderror
            </div>
        </div>

        <div class="flex gap-3">
            <button type="submit" class="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">
                Perbarui
            </button>
            <a href="{{ route('products.index') }}" class="rounded-md border px-4 py-2 hover:bg-gray-50">
                Batal
            </a>
        </div>
    </form>
@endsection
```

### Halaman detail produk

Here's your complete `resources/views/products/show.blade.php`:

```blade title="resources/views/products/show.blade.php"
@extends('layouts.app')

@section('title', $product->name)

@section('content')
    <div class="rounded-md bg-white p-6 shadow">
        <h1 class="mb-4 text-2xl font-bold">{{ $product->name }}</h1>

        <dl class="space-y-3 text-sm">
            <div>
                <dt class="font-semibold">Deskripsi</dt>
                <dd>{{ $product->description ?: '-' }}</dd>
            </div>
            <div>
                <dt class="font-semibold">Harga</dt>
                <dd>Rp {{ number_format($product->price, 0, ',', '.') }}</dd>
            </div>
            <div>
                <dt class="font-semibold">Stok</dt>
                <dd>{{ $product->stock }}</dd>
            </div>
        </dl>

        <div class="mt-6 flex gap-3">
            <a href="{{ route('products.edit', $product) }}"
               class="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700">Edit</a>
            <a href="{{ route('products.index') }}"
               class="rounded-md border px-4 py-2 hover:bg-gray-50">Kembali</a>
        </div>
    </div>
@endsection
```

---

## Langkah 11 — Uji coba

Pastikan `composer run dev` masih menyala (atau jalankan `php artisan serve` dan `npm run dev` di dua terminal), lalu buka `http://localhost:8000`.

Checklist uji:

1. **Create** — klik *Tambah Produk*, kirim form kosong → pesan error validasi muncul dan input lain tidak hilang.
2. **Create (valid)** — isi data benar → kembali ke daftar dengan pesan hijau "Produk berhasil ditambahkan."
3. **Read** — buka *Detail* → data tampil sesuai.
4. **Update** — klik *Edit*, ubah harga → pesan "Produk berhasil diperbarui."
5. **Delete** — klik *Hapus* → muncul konfirmasi → data hilang dari daftar.
6. **Pagination** — tambahkan lebih dari 10 produk → link halaman muncul di bawah tabel.

---

## Error yang sering muncul

| Gejala | Penyebab | Solusi |
|---|---|---|
| `403 Forbidden` saat submit form | `authorize()` di Form Request masih `false` | Ubah menjadi `return true;` |
| `View [products.index] not found` | File view belum dibuat / salah nama folder | `php artisan make:view products.index`, pastikan folder `products` |
| `Unable to locate file in Vite manifest` | Vite belum jalan / asset belum di-build | Jalankan `composer run dev` atau `npm run dev` (produksi: `npm run build`) |
| `419 Page Expired` | `@csrf` lupa di form | Tambahkan `@csrf` tepat di bawah tag `<form>` |
| `Add [name] to fillable property...` | Kolom belum ada di `$fillable` | Tambahkan ke `$fillable` pada model |
| `Class "App\Http\Controllers\ProductController" not found` | Nama file/class huruf kecil (di Linux case-sensitive) | Samakan nama file dan class (`ProductController`), lalu `composer dump-autoload` |
| `Route [products.index] not defined` | `Route::resource` belum ditambahkan | Cek `routes/web.php` dan `php artisan route:list` |
| `Call to undefined method ...::created()` | Salah ketik method | Gunakan `Product::create(...)` |
| Edit/hapus menampilkan model kosong | Nama parameter method tidak sama dengan route (`$products` vs `{product}`) | Samakan menjadi `$product` |

---

## Bonus — Konfirmasi hapus dengan SweetAlert2

Ganti `confirm()` bawaan browser dengan dialog yang lebih rapi.

Pasang paketnya:

```bash
npm install sweetalert2
```

Here's your complete `resources/js/app.js`:

```js title="resources/js/app.js"
import './bootstrap';
import Swal from 'sweetalert2';

window.Swal = Swal;

window.confirmDelete = (form, productName) => {
    Swal.fire({
        title: 'Hapus produk?',
        text: `Produk "${productName}" akan dihapus permanen.`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#dc2626',
        reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed) {
            form.submit();
        }
    });
};
```

Di `products/index.blade.php`, ubah form hapus menjadi:

```blade title="resources/views/products/index.blade.php (bagian form hapus)"
<form action="{{ route('products.destroy', $product) }}" method="POST" class="inline">
    @csrf
    @method('DELETE')
    <button type="button"
            class="text-red-600 hover:text-red-900"
            onclick="confirmDelete(this.form, @js($product->name))">
        Hapus
    </button>
</form>
```

Pakai `@js(...)` (bukan `'{{ $product->name }}'`) supaya nama produk yang mengandung tanda petik, misalnya `Es Teh's`, tidak merusak JavaScript.

---

## Struktur file akhir

```text
laravel13-crud/
├── app/
│   ├── Http/
│   │   ├── Controllers/ProductController.php
│   │   └── Requests/
│   │       ├── StoreProductRequest.php
│   │       └── UpdateProductRequest.php
│   └── Models/Product.php
├── database/migrations/xxxx_create_products_table.php
├── resources/
│   ├── js/app.js
│   └── views/
│       ├── layouts/app.blade.php
│       └── products/
│           ├── index.blade.php
│           ├── create.blade.php
│           ├── edit.blade.php
│           └── show.blade.php
└── routes/web.php
```

## Catatan: memakai MySQL

Ubah bagian database di `.env`, buat database kosongnya, lalu jalankan `php artisan migrate`:

```ini title=".env"
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel13_crud
DB_USERNAME=root
DB_PASSWORD=
```

## Cek pemahamanmu

Sebelum lanjut, pastikan kamu bisa menjawab:

- [ ] Apa beda `create()` dan `store()`, serta `edit()` dan `update()`?
- [ ] Dari mana `$product` di `show(Product $product)` berasal?
- [ ] Kenapa `authorize()` harus `true`?
- [ ] Kenapa form edit memakai `@method('PUT')`?
- [ ] Kapan memakai `old()` dan `@error`?

## Next Step

Sekarang semua logic (query, simpan, ubah, hapus) masih ada di controller. Itu wajar untuk belajar, tetapi saat aplikasi membesar, controller jadi gemuk dan sulit diuji.

**Lanjut ke: Service Pattern** — pindahkan logic ke `ProductService` dan buat controller menjadi tipis.