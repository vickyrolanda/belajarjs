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

## 3) Buat File-File Proyek (copy–paste isi file)

Di langkah ini Anda akan membuat semua file yang diperlukan. Anda bisa membuat file lewat VS Code (rekomendasi) atau Notepad, lalu salin-tempel isi file sesuai di bawah.

Opsional (membuat folder `public` via PowerShell):

```powershell
New-Item -ItemType Directory public -Force
```

### 3.1) server.js

Buat file `server.js` di root proyek dan isi persis seperti berikut:

```javascript
const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Simple in-memory check (demo only)
// Untuk aplikasi nyata, JANGAN hardcode kredensial. Gunakan DB dan hashing password.
const DEMO_USER = {
  username: 'user@example.com',
  password: 'password123'
};

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(200).json({ success: false, message: 'Username dan password wajib diisi.' });
  }

  // Simple match (case sensitive)
  if (username === DEMO_USER.username && password === DEMO_USER.password) {
    return res.status(200).json({ success: true, message: 'Login berhasil.' });
  }

  return res.status(200).json({ success: false, message: 'Login gagal. Periksa kembali kredensial Anda.' });
});

// Fallback ke index.html untuk route lain
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
```

Penjelasan singkat:
- Mengaktifkan `express.json()` agar body JSON dapat dibaca.
- Menyajikan file statis dari folder `public/`.
- `POST /api/login` memeriksa kredensial demo dan mengembalikan `{ success, message }`.
- Fallback `app.get('*')` mengembalikan `public/index.html` untuk rute lain (single-page feel).

### 3.2) public/index.html

Buat file `public/index.html` dengan isi berikut:

```html
<!doctype html>
<html lang="id">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Login Sederhana</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <div class="container">
      <h1>Login</h1>
      <form id="loginForm" autocomplete="on">
        <label for="username">Email / Username</label>
        <input type="text" id="username" name="username" placeholder="user@example.com" required />

        <label for="password">Password</label>
        <input type="password" id="password" name="password" placeholder="••••••••" required />

        <button type="submit">Masuk</button>
      </form>

      <div id="message" role="status" aria-live="polite"></div>

      <details class="hint">
        <summary>Hint kredensial demo</summary>
        <p>
          Email: <code>user@example.com</code><br />
          Password: <code>password123</code>
        </p>
      </details>
    </div>

    <script src="/app.js"></script>
  </body>
  </html>
```

### 3.3) public/app.js

Buat file `public/app.js` dengan isi berikut:

```javascript
const form = document.getElementById('loginForm');
const messageBox = document.getElementById('message');

function setMessage(text, type = 'info') {
  messageBox.textContent = text;
  messageBox.className = '';
  messageBox.classList.add('message', type);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  setMessage('Memproses...', 'info');

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      setMessage(data.message || 'Login berhasil.', 'success');
    } else {
      setMessage(data.message || 'Login gagal.', 'error');
    }
  } catch (err) {
    console.error(err);
    setMessage('Terjadi kesalahan jaringan/server.', 'error');
  }
});
```

### 3.4) public/styles.css

Buat file `public/styles.css` dengan isi berikut:

```css
* { box-sizing: border-box; }
:root {
  --bg: #0f172a;
  --card: #111827;
  --text: #e5e7eb;
  --muted: #9ca3af;
  --primary: #2563eb;
  --success: #16a34a;
  --error: #dc2626;
}
html, body { height: 100%; }
body {
  margin: 0;
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji";
  background: linear-gradient(180deg, #0b1220, #0f172a);
  color: var(--text);
  display: grid;
  place-items: center;
  padding: 1rem;
}
.container {
  width: 100%;
  max-width: 420px;
  background: var(--card);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px;
  padding: 1.25rem 1.25rem 1.5rem;
  box-shadow: 0 10px 30px rgba(0,0,0,0.35);
}
.container h1 {
  margin: 0 0 1rem;
  font-size: 1.375rem;
}
label {
  display: block;
  margin: 0.5rem 0 0.375rem;
  color: var(--muted);
  font-size: 0.9rem;
}
input[type="text"], input[type="password"] {
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: 1px solid rgba(255,255,255,0.12);
  border-radius: 8px;
  background: #0b1020;
  color: var(--text);
  outline: none;
}
input[type="text"]:focus, input[type="password"]:focus {
  border-color: rgba(37, 99, 235, 0.65);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.25);
}
button[type="submit"] {
  margin-top: 0.875rem;
  width: 100%;
  padding: 0.625rem 0.75rem;
  border: none;
  border-radius: 8px;
  background: var(--primary);
  color: white;
  font-weight: 600;
  cursor: pointer;
}
button[type="submit"]:hover {
  filter: brightness(1.08);
}
.message {
  margin-top: 0.875rem;
  padding: 0.625rem 0.75rem;
  border-radius: 8px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.08);
}
.message.success { border-color: rgba(22,163,74,0.6); background: rgba(22,163,74,0.12); }
.message.error { border-color: rgba(220,38,38,0.6); background: rgba(220,38,38,0.12); }
.message.info { border-color: rgba(37,99,235,0.6); background: rgba(37,99,235,0.12); }

.hint { margin-top: 0.75rem; color: var(--muted); }
.hint code { color: var(--text); }
```

Selesai. Setelah keempat file dibuat, lanjut.

## 4) Struktur Proyek

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

## 5) Instalasi Dependensi

Jalankan perintah berikut dari folder proyek Anda (misal: `d:\laragon\www\belajarjs`):

```powershell
npm install
```

Perintah di atas akan menginstal `express` sesuai `package.json`.

## 6) Menjalankan Server

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

## 7) Mencoba Login

- Masukkan kredensial benar:
  - Email/Username: `user@example.com`
  - Password: `password123`
- Klik tombol “Masuk”.
- Anda akan melihat pesan “Login berhasil.”

Coba juga kredensial yang salah untuk melihat pesan “Login gagal …”.

> Perilaku aplikasi ini: tidak ada redirect atau tampilan setelah login. Hanya menampilkan pesan berhasil/gagal di halaman yang sama.

## 8) Penjelasan Kode (Backend & Frontend)

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

## 9) Alur Data Singkat

1. Pengguna isi form lalu klik “Masuk”.
2. `app.js` mengirim POST ke `/api/login` dengan JSON `{ username, password }`.
3. `server.js` memvalidasi kredensial demo dan mengirim JSON hasil: `{ success, message }`.
4. `app.js` menampilkan pesan pada `#message` tanpa pindah halaman.

## 10) Kustomisasi (Opsional)

- Ubah kredensial demo di `server.js` (variabel `DEMO_USER`).
- Ganti teks, judul, atau gaya di `public/index.html` dan `public/styles.css`.
- Tambahkan validasi form di sisi klien (misal, format email) pada `public/app.js`.

## 11) Troubleshooting

- Port sudah dipakai? Ubah port di environment variable sebelum `npm start`:

```powershell
$env:PORT = 5000; npm start
```

- Perubahan tidak terlihat? Pastikan Anda memuat ulang halaman browser, atau kosongkan cache.
- Error “module not found” → pastikan sudah menjalankan `npm install` di folder proyek yang benar.

Selamat mencoba! 🎉
