# Tutorial 1 — Login Sederhana dengan Express

Dokumen ini memandu Anda membuat tampilan login sederhana yang hanya menampilkan pesan “berhasil” atau “gagal” tanpa berpindah halaman. Backend menggunakan Express (Node.js).

> Catatan: Kredensial demo yang bisa Anda gunakan:
>
> - Email/Username: `user@example.com`
> - Password: `password123`

## 1) Persiapan

- Pastikan Node.js sudah terpasang. Cek versi:

```powershell
node -v
npm -v
```

Jika belum terpasang, instal dari https://nodejs.org/.

## 2) Struktur Proyek

Repository ini berisi beberapa file penting:

- `server.js` — Server Express untuk API `/api/login` dan menyajikan file statis dari folder `public`.
- `public/index.html` — Halaman login.
- `public/app.js` — Script frontend untuk memproses submit form dan memanggil API.
- `public/styles.css` — Styling sederhana.
- `package.json` — Konfigurasi npm dengan script `start`.

> File lama `index.html` di root tidak dipakai oleh server Express ini. Aplikasi akan menyajikan `public/index.html` ketika Anda membuka `http://localhost:3000`.

## 3) Instalasi Dependensi

Jalankan perintah berikut dari folder proyek Anda (misal: `d:\laragon\www\belajarjs`):

```powershell
npm install
```

Perintah di atas akan menginstal `express` sesuai `package.json`.

## 4) Menjalankan Server

Jalankan server Express:

```powershell
npm start
```

Jika berhasil, Anda akan melihat output di terminal:

```
Server berjalan di http://localhost:3000
```

Buka browser dan akses:

```
http://localhost:3000
```

Anda akan melihat halaman login.

## 5) Mencoba Login

- Masukkan kredensial benar:
  - Email/Username: `user@example.com`
  - Password: `password123`
- Klik tombol “Masuk”.
- Anda akan melihat pesan “Login berhasil.”

Coba juga kredensial yang salah untuk melihat pesan “Login gagal …”.

> Perilaku aplikasi ini: tidak ada redirect atau tampilan setelah login. Hanya menampilkan pesan berhasil/gagal di halaman yang sama.

## 6) Cara Kerja Singkat

- Frontend (`public/app.js`) menangkap event submit form, lalu mengirim payload JSON ke `POST /api/login`.
- Backend (`server.js`) memeriksa username/password melawan konstanta demo:
  - Jika cocok → balas `{ success: true, message: 'Login berhasil.' }`.
  - Jika tidak cocok → balas `{ success: false, message: 'Login gagal …' }`.
- Frontend menampilkan pesan dari respons tanpa berpindah halaman.

## 7) Kustomisasi (Opsional)

- Ubah kredensial demo di `server.js` (variabel `DEMO_USER`).
- Ganti teks, judul, atau gaya di `public/index.html` dan `public/styles.css`.
- Tambahkan validasi form di sisi klien (misal, format email) pada `public/app.js`.

## 8) Troubleshooting

- Port sudah dipakai? Ubah port di environment variable sebelum `npm start`:

```powershell
$env:PORT = 5000; npm start
```

- Perubahan tidak terlihat? Pastikan Anda memuat ulang halaman browser, atau kosongkan cache.
- Error “module not found” → pastikan sudah menjalankan `npm install` di folder proyek yang benar.

Selamat mencoba! 🎉
