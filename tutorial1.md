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

## 2) Inisialisasi Proyek & package.json

Di repo ini, file `package.json` sudah disiapkan. Bagian ini menjelaskan cara membuatnya dari nol dan arti tiap field.

### Cara cepat (otomatis)

```powershell
# Jalankan dari folder proyek (mis: d:\laragon\www\belajarjs)
npm init -y

# Tambahkan dependensi express
npm install express
```

Perintah di atas membuat `package.json` dasar dan menambahkan `express` ke `dependencies`.

### Cara manual (isi yang digunakan di proyek ini)

Berikut contoh `package.json` yang kita pakai:

```json
{
  "name": "belajarjs-login",
  "version": "1.0.0",
  "private": true,
  "description": "Simple Express login demo (message only)",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  },
  "keywords": ["express", "login", "demo"],
  "author": "",
  "license": "MIT",
  "dependencies": {
    "express": "^4.19.2"
  }
}
```

Penjelasan field penting:

- `name` dan `version`: Identitas paket Anda.
- `private: true`: Mencegah paket tak sengaja dipublikasikan ke npm.
- `description`, `keywords`, `author`, `license`: Metadata proyek.
- `main`: Entry file utama (di sini `server.js`).
- `scripts.start`: Perintah yang dijalankan saat `npm start`.
- `dependencies.express`: Menyatakan kita memakai Express, versi `^4.19.2`.

## 3) Struktur Proyek

Struktur minimal yang kita gunakan:

```
belajarjs/
├─ server.js
├─ package.json
└─ public/
   ├─ index.html
   ├─ app.js
   └─ styles.css
```

> File lama `index.html` di root tidak dipakai oleh server Express ini. Aplikasi akan menyajikan `public/index.html` ketika Anda membuka `http://localhost:3000`.

## 4) Instalasi Dependensi

Jalankan perintah berikut dari folder proyek Anda (misal: `d:\laragon\www\belajarjs`):

```powershell
npm install
```

Perintah di atas akan menginstal `express` sesuai `package.json`.

## 5) Menjalankan Server

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

## 6) Mencoba Login

- Masukkan kredensial benar:
  - Email/Username: `user@example.com`
  - Password: `password123`
- Klik tombol “Masuk”.
- Anda akan melihat pesan “Login berhasil.”

Coba juga kredensial yang salah untuk melihat pesan “Login gagal …”.

> Perilaku aplikasi ini: tidak ada redirect atau tampilan setelah login. Hanya menampilkan pesan berhasil/gagal di halaman yang sama.

## 7) Penjelasan Kode (Backend & Frontend)

### server.js (Backend Express)

Tugas utama: menyajikan file statis dari `public/` dan menyediakan endpoint `POST /api/login`.

Potongan penting:

```js
const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json()); // parsing JSON body
app.use(express.static(path.join(__dirname, 'public'))); // serve /public
```

Kredensial demo (hanya untuk contoh):

```js
const DEMO_USER = { username: 'user@example.com', password: 'password123' };
```

Endpoint login:

```js
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return res.json({ success: false, message: 'Username dan password wajib diisi.' });
  }
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    return res.json({ success: true, message: 'Login berhasil.' });
  }
  return res.json({ success: false, message: 'Login gagal. Periksa kembali kredensial Anda.' });
});
```

Fallback ke `public/index.html` untuk semua route lain:

```js
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
```

Menjalankan server:

```js
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
```

> Keamanan: Dalam aplikasi nyata, JANGAN simpan password plaintext. Gunakan hashing (bcrypt/argon2), validasi input, rate limiting, dan penyimpanan di database.

### public/index.html (UI Login)

Struktur inti:

- Link ke `styles.css` untuk styling dan `app.js` untuk logika.
- Form dengan `id="loginForm"`, berisi input `username` dan `password`, serta `div#message` untuk menampilkan hasil.
- Komponen `<details>` berisi hint kredensial demo.

### public/app.js (Logika Client-side)

Alur kerja:

```js
const form = document.getElementById('loginForm');
const messageBox = document.getElementById('message');

function setMessage(text, type = 'info') {
  messageBox.textContent = text;
  messageBox.className = '';
  messageBox.classList.add('message', type); // info/success/error
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  setMessage('Memproses...', 'info');
  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  setMessage(data.message || (data.success ? 'Login berhasil.' : 'Login gagal.'), data.success ? 'success' : 'error');
});
```

Tidak ada redirect. Hanya menampilkan pesan berdasarkan respons server.

### public/styles.css (Styling)

- Variabel warna dasar dan gaya kartu sederhana.
- Tata letak yang center-aligned.
- State pesan dengan kelas: `.message.info`, `.message.success`, `.message.error`.

## 8) Alur Data Singkat

1. Pengguna isi form lalu klik “Masuk”.
2. `app.js` mengirim POST ke `/api/login` dengan JSON `{ username, password }`.
3. `server.js` memvalidasi kredensial demo dan mengirim JSON hasil: `{ success, message }`.
4. `app.js` menampilkan pesan pada `#message` tanpa pindah halaman.

## 9) Kustomisasi (Opsional)

- Ubah kredensial demo di `server.js` (variabel `DEMO_USER`).
- Ganti teks, judul, atau gaya di `public/index.html` dan `public/styles.css`.
- Tambahkan validasi form di sisi klien (misal, format email) pada `public/app.js`.

## 10) Troubleshooting

- Port sudah dipakai? Ubah port di environment variable sebelum `npm start`:

```powershell
$env:PORT = 5000; npm start
```

- Perubahan tidak terlihat? Pastikan Anda memuat ulang halaman browser, atau kosongkan cache.
- Error “module not found” → pastikan sudah menjalankan `npm install` di folder proyek yang benar.

Selamat mencoba! 🎉
