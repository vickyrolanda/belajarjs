# Tutorial: Membuat Form Login dengan Database menggunakan Node.js & Express

## 📚 Daftar Isi
1. [Pengenalan](#pengenalan)
2. [Persiapan Project](#persiapan-project)
3. [Struktur Project](#struktur-project)
4. [Penjelasan Backend (server.js)](#penjelasan-backend)
5. [Penjelasan Frontend (HTML, CSS, JS)](#penjelasan-frontend)
6. [Cara Menjalankan Aplikasi](#cara-menjalankan-aplikasi)
7. [Testing Aplikasi](#testing-aplikasi)
8. [Penjelasan Cara Kerja](#penjelasan-cara-kerja)
9. [Tips & Best Practices](#tips-best-practices)

---

## 🎯 Pengenalan

Tutorial ini akan mengajarkan cara membuat sistem login sederhana menggunakan:
- **Backend**: Node.js + Express.js
- **Database**: SQLite (better-sqlite3)
- **Frontend**: HTML, CSS, JavaScript (Vanilla)

### Apa yang Akan Dipelajari?
- ✅ Setup Express server
- ✅ Koneksi ke database SQLite
- ✅ Membuat tabel dan insert data
- ✅ Validasi login dengan database
- ✅ Komunikasi frontend-backend dengan Fetch API
- ✅ Menampilkan pesan success/error

---

## 🛠️ Persiapan Project

### 1. Instalasi Node.js
Pastikan Node.js sudah terinstall di komputer Anda. Cek dengan:
```bash
node --version
npm --version
```

### 2. Inisialisasi Project
```bash
# Buat folder project (jika belum ada)
mkdir belajarjs
cd belajarjs

# Inisialisasi npm (akan membuat package.json)
npm init -y
```

### 3. Install Dependencies
```bash
# Install Express (web framework)
npm install express

# Install better-sqlite3 (database SQLite)
npm install better-sqlite3
```

---

## 📁 Struktur Project

```
belajarjs/
│
├── server.js              # Backend Express server
├── package.json           # Konfigurasi npm
├── login.db              # Database SQLite (dibuat otomatis)
│
└── public/               # Folder untuk frontend
    ├── index.html        # Halaman login
    ├── app.js           # JavaScript frontend
    └── styles.css       # Styling CSS
```

---

## 🔧 Penjelasan Backend (server.js)

### Kode Lengkap: server.js
```javascript
const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Setup Database
const db = new Database('login.db');

// Buat tabel users jika belum ada
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);

// Insert data demo jika tabel masih kosong
const countUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (countUsers.count === 0) {
  const insert = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  insert.run('user@example.com', 'password123');
  insert.run('admin@example.com', 'admin123');
  console.log('Data demo berhasil ditambahkan ke database');
}

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(200).json({ success: false, message: 'Username dan password wajib diisi.' });
  }

  // Cek data di database
  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?').get(username, password);

  if (user) {
    return res.status(200).json({ success: true, message: 'Login berhasil.' });
  }

  return res.status(200).json({ success: false, message: 'Login gagal. Username atau password salah.' });
});

// Fallback to index.html for root
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
```

### 📝 Penjelasan Detail Backend

#### 1. Import Module
```javascript
const express = require('express');
const path = require('path');
const Database = require('better-sqlite3');
```
- **express**: Framework untuk membuat web server
- **path**: Untuk mengelola path file
- **Database**: Library untuk koneksi ke SQLite

#### 2. Setup Express App
```javascript
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
```
- Membuat instance Express
- Setting port 3000
- `express.json()`: Middleware untuk parsing JSON
- `express.static()`: Serve file statis dari folder `public`

#### 3. Setup Database
```javascript
const db = new Database('login.db');

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL
  )
`);
```
- Membuat/membuka database `login.db`
- Membuat tabel `users` dengan struktur:
  - `id`: Primary key, auto increment
  - `username`: Text, unique, tidak boleh null
  - `password`: Text, tidak boleh null

#### 4. Insert Data Demo
```javascript
const countUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
if (countUsers.count === 0) {
  const insert = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
  insert.run('user@example.com', 'password123');
  insert.run('admin@example.com', 'admin123');
  console.log('Data demo berhasil ditambahkan ke database');
}
```
- Cek jumlah user di database
- Jika kosong, insert 2 user demo
- **Catatan**: Ini hanya untuk demo, di production gunakan password yang di-hash!

#### 5. Endpoint Login
```javascript
app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(200).json({ 
      success: false, 
      message: 'Username dan password wajib diisi.' 
    });
  }

  const user = db.prepare('SELECT * FROM users WHERE username = ? AND password = ?')
    .get(username, password);

  if (user) {
    return res.status(200).json({ 
      success: true, 
      message: 'Login berhasil.' 
    });
  }

  return res.status(200).json({ 
    success: false, 
    message: 'Login gagal. Username atau password salah.' 
  });
});
```
**Cara Kerja:**
1. Terima data `username` dan `password` dari frontend
2. Validasi: pastikan keduanya tidak kosong
3. Query database: cari user dengan username & password yang cocok
4. Jika ditemukan → return `success: true`
5. Jika tidak → return `success: false`

#### 6. Start Server
```javascript
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
```
- Jalankan server di port 3000
- Tampilkan pesan di console

---

## 🎨 Penjelasan Frontend

### 1. HTML (public/index.html)
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
        <input type="text" id="username" name="username" 
               placeholder="user@example.com" required />

        <label for="password">Password</label>
        <input type="password" id="password" name="password" 
               placeholder="••••••••" required />

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

**Elemen Penting:**
- `<form id="loginForm">`: Form untuk input username & password
- `<div id="message">`: Area untuk menampilkan pesan hasil login
- `<details>`: Hint kredensial untuk testing
- `<script src="/app.js">`: Load JavaScript

### 2. JavaScript (public/app.js)
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

**Penjelasan JavaScript:**

1. **Ambil Elemen DOM**
```javascript
const form = document.getElementById('loginForm');
const messageBox = document.getElementById('message');
```

2. **Function setMessage**
```javascript
function setMessage(text, type = 'info') {
  messageBox.textContent = text;
  messageBox.className = '';
  messageBox.classList.add('message', type);
}
```
- Menampilkan pesan ke user
- `type`: `info`, `success`, atau `error`

3. **Event Listener Submit**
```javascript
form.addEventListener('submit', async (e) => {
  e.preventDefault();  // Cegah form submit default
  setMessage('Memproses...', 'info');

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());
  // Hasil: { username: '...', password: '...' }
```

4. **Fetch API - Kirim Data ke Server**
```javascript
const res = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
});
```
- Kirim POST request ke `/api/login`
- Body: JSON dengan username & password

5. **Handle Response**
```javascript
const data = await res.json();
if (data.success) {
  setMessage(data.message || 'Login berhasil.', 'success');
} else {
  setMessage(data.message || 'Login gagal.', 'error');
}
```
- Parse response JSON
- Tampilkan pesan sesuai hasil

### 3. CSS (public/styles.css)
File CSS lengkap sudah ada di project Anda, dengan fitur:
- Dark mode theme
- Responsive design
- Styling untuk message (success/error/info)
- Smooth animations

---

## 🚀 Cara Menjalankan Aplikasi

### 1. Pastikan Dependencies Terinstall
```bash
npm install
```

### 2. Jalankan Server
```bash
npm start
```

Output yang diharapkan:
```
Data demo berhasil ditambahkan ke database
Server berjalan di http://localhost:3000
```

### 3. Buka Browser
Akses: **http://localhost:3000**

---

## 🧪 Testing Aplikasi

### Test Case 1: Login Berhasil
**Input:**
- Username: `user@example.com`
- Password: `password123`

**Expected Output:**
- ✅ Pesan hijau: "Login berhasil."

### Test Case 2: Login Berhasil (User 2)
**Input:**
- Username: `admin@example.com`
- Password: `admin123`

**Expected Output:**
- ✅ Pesan hijau: "Login berhasil."

### Test Case 3: Login Gagal (Password Salah)
**Input:**
- Username: `user@example.com`
- Password: `wrongpassword`

**Expected Output:**
- ❌ Pesan merah: "Login gagal. Username atau password salah."

### Test Case 4: Login Gagal (User Tidak Ada)
**Input:**
- Username: `nonexistent@example.com`
- Password: `password123`

**Expected Output:**
- ❌ Pesan merah: "Login gagal. Username atau password salah."

### Test Case 5: Validasi Empty Field
**Input:**
- Username: (kosong)
- Password: (kosong)

**Expected Output:**
- ❌ Pesan merah: "Username dan password wajib diisi."

---

## 📊 Penjelasan Cara Kerja

### Flow Diagram

```
┌─────────────┐
│   Browser   │
│  (Frontend) │
└──────┬──────┘
       │
       │ 1. User input username & password
       │ 2. Submit form
       │
       ▼
┌─────────────────────────────────┐
│   app.js (Frontend JavaScript)   │
│                                  │
│  - Tangkap event submit         │
│  - Ambil data form              │
│  - Kirim POST request via Fetch │
└──────────────┬──────────────────┘
               │
               │ POST /api/login
               │ { username: "...", password: "..." }
               │
               ▼
┌─────────────────────────────────┐
│   server.js (Backend Express)    │
│                                  │
│  - Terima request               │
│  - Validasi input               │
│  - Query database               │
│  - Return response JSON         │
└──────────────┬──────────────────┘
               │
               │ Query: SELECT * FROM users
               │        WHERE username = ? AND password = ?
               │
               ▼
┌─────────────────────────────────┐
│   login.db (SQLite Database)     │
│                                  │
│  Tabel: users                   │
│  ┌────┬──────────────┬─────┐   │
│  │ id │  username    │ pwd │   │
│  ├────┼──────────────┼─────┤   │
│  │ 1  │ user@exa...  │ ... │   │
│  │ 2  │ admin@ex...  │ ... │   │
│  └────┴──────────────┴─────┘   │
└──────────────┬──────────────────┘
               │
               │ Return: user data atau null
               │
               ▼
┌─────────────────────────────────┐
│   server.js                      │
│                                  │
│  if (user) → success: true      │
│  else → success: false          │
└──────────────┬──────────────────┘
               │
               │ Response JSON:
               │ { success: true/false, message: "..." }
               │
               ▼
┌─────────────────────────────────┐
│   app.js (Frontend)              │
│                                  │
│  - Parse response               │
│  - Tampilkan pesan ke user      │
└─────────────────────────────────┘
               │
               ▼
┌─────────────┐
│   Browser   │
│  Tampilkan  │
│   Pesan     │
└─────────────┘
```

---

## 💡 Tips & Best Practices

### ⚠️ Catatan Keamanan (Untuk Production)

**JANGAN** gunakan kode ini untuk production tanpa modifikasi!

#### 1. Hash Password
Jangan simpan password plain text. Gunakan bcrypt:
```javascript
// Install: npm install bcrypt
const bcrypt = require('bcrypt');

// Saat registrasi
const hashedPassword = await bcrypt.hash(password, 10);
insert.run(username, hashedPassword);

// Saat login
const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username);
if (user) {
  const match = await bcrypt.compare(password, user.password);
  if (match) {
    // Login berhasil
  }
}
```

#### 2. Gunakan Session atau JWT
Jangan hanya return "login berhasil". Gunakan:
- **Session**: express-session
- **JWT**: jsonwebtoken

#### 3. Validasi Input
Tambahkan validasi:
- Email format
- Password minimum length
- Sanitasi input (cegah SQL injection)

#### 4. HTTPS
Gunakan HTTPS, jangan HTTP!

#### 5. Rate Limiting
Batasi jumlah login attempt:
```javascript
// Install: npm install express-rate-limit
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 5 // max 5 request
});

app.post('/api/login', loginLimiter, (req, res) => {
  // ...
});
```

### 🔍 Debugging Tips

#### 1. Cek Console Browser
Buka Developer Tools (F12) → Console untuk melihat error

#### 2. Cek Terminal Server
Lihat output di terminal tempat server berjalan

#### 3. Test dengan curl
```bash
curl -X POST http://localhost:3000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username":"user@example.com","password":"password123"}'
```

#### 4. Lihat Isi Database
Install SQLite browser atau gunakan command:
```bash
# Install sqlite3 CLI (jika belum ada)
# Buka database
sqlite3 login.db

# Query
SELECT * FROM users;

# Exit
.exit
```

### 📚 Resources untuk Belajar Lebih Lanjut

1. **Express.js**: https://expressjs.com/
2. **SQLite**: https://www.sqlite.org/
3. **Fetch API**: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
4. **Node.js**: https://nodejs.org/

---

## 🎓 Latihan Tambahan

Coba kembangkan aplikasi ini dengan fitur:

### Level 1 (Pemula)
- ✅ Tambah tombol "Show/Hide Password"
- ✅ Tambah user baru lewat endpoint `/api/register`
- ✅ Validasi email format di frontend

### Level 2 (Intermediate)
- ✅ Implementasi bcrypt untuk hash password
- ✅ Tambah halaman dashboard setelah login
- ✅ Gunakan JWT untuk authentication
- ✅ Tambah fitur "Remember Me"

### Level 3 (Advanced)
- ✅ Implementasi refresh token
- ✅ Tambah fitur "Forgot Password"
- ✅ Rate limiting
- ✅ Email verification
- ✅ Two-factor authentication (2FA)

---

## 📝 Kesimpulan

Anda telah belajar:
- ✅ Membuat Express server
- ✅ Koneksi ke database SQLite
- ✅ Membuat endpoint API
- ✅ Komunikasi frontend-backend
- ✅ Validasi login dengan database

**Next Steps:**
1. Pelajari security best practices
2. Implementasi JWT/Session
3. Deploy ke hosting (Heroku, Vercel, dll)

---

**Selamat Belajar! 🚀**

Jika ada pertanyaan, silakan buat issue atau hubungi instruktur.
