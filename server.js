const express = require('express');
const path = require('path');
const session = require('express-session');
const multer = require('multer'); // Tambahkan ini
const fs = require('fs'); // Tambahkan ini
const { promisePool, testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Konfigurasi Penyimpanan File (Multer)
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/';
        if (!fs.existsSync(dir)) fs.mkdirSync(dir); // Buat folder uploads jika belum ada
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

// Middleware
app.use(express.json());
app.use(session({
    secret: 'taskjournal-secret-2025',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000, httpOnly: true }
}));

// Akses Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const requireLogin = (req, res, next) => {
    if (!req.session.user) return res.redirect('/');
    next();
};


// Memastikan session user aktif
app.get('/api/check-session', (req, res) => {
    if (req.session.user) {
        res.json({ loggedIn: true, user: req.session.user });
    } else {
        res.json({ loggedIn: false });
    }
});

// Mengambil daftar file berdasarkan ID folder
app.get('/api/files/:folderId', requireLogin, async (req, res) => {
    const { folderId } = req.params;
    try {
        const [rows] = await promisePool.execute(
            'SELECT * FROM files WHERE folder_id = ?', 
            [folderId]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).json({ success: false, message: 'Gagal mengambil file' });
    }
});

// --- AUTHENTICATION ---
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    
    try {
        // Ambil data user berdasarkan username dan password
        const [rows] = await promisePool.execute(
            'SELECT * FROM users WHERE username = ? AND password = ?', 
            [username, password]
        );

        // CEK DI SINI: Kita periksa apakah baris (rows) ditemukan
        if (rows.length > 0) {
            const user = rows[0]; // Ambil data user pertama yang ditemukan
            
            // Simpan ke session
            req.session.user = { id: user.id, username: user.username };
            
            // Kirim respon sukses
            return res.json({ 
                success: true, 
                message: 'Login Berhasil', 
                redirect: 'dashboard.html' 
            });
        } else {
            // Jika tidak ada user yang cocok
            return res.json({ 
                success: false, 
                message: 'Username atau Password salah!' 
            });
        }
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ success: false, message: 'Database Error' });
    }
});

// 1. Middleware
app.use(express.json());

// 2. API Routes (Taruh SEMUA rute API di sini)
app.get('/api/check-session', (req, res) => {
    if (req.session.user) {
        res.json({ success: true, user: req.session.user });
    } else {
        res.json({ success: false });
    }
});

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await promisePool.execute('SELECT * FROM users WHERE username = ? AND password = ?', [username, password]);
        
        if (rows.length > 0) {
            req.session.user = { id: rows[0].id, username: rows[0].username };
            // Pastikan mengirim JSON sukses agar dashboard terbuka
            res.json({ success: true, message: 'Login berhasil', redirect: 'dashboard.html' });
        } else {
            res.json({ success: false, message: 'Username atau Password salah' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Error server' });
    }
});

// 3. Static Files
app.use(express.static('public'));


// --- API FOLDERS ---
app.get('/api/folders', requireLogin, async (req, res) => {
    try {
        const [rows] = await promisePool.execute('SELECT * FROM folders WHERE user_id = ?', [req.session.user.id]);
        res.json({ success: true, data: rows });
    } catch (error) { res.status(500).send(); }
});

app.post('/api/folders', requireLogin, async (req, res) => {
    const { name } = req.body;
    try {
        await promisePool.execute('INSERT INTO folders (user_id, name) VALUES (?, ?)', [req.session.user.id, name]);
        res.json({ success: true });
    } catch (error) { res.status(500).send(); }
});

// --- API FILES (Fitur Baru: Upload & Get) ---
app.post('/api/upload', requireLogin, upload.single('file'), async (req, res) => {
    const { folder_id } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ success: false, message: 'File wajib ada' });

    try {
        await promisePool.execute(
            'INSERT INTO files (folder_id, file_name, file_path, file_type) VALUES (?, ?, ?, ?)',
            [folder_id, file.originalname, file.path, file.mimetype]
        );
        res.json({ success: true, message: 'File berhasil diunggah' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal simpan database' });
    }
});

app.get('/api/files/:folderId', requireLogin, async (req, res) => {
    try {
        const [rows] = await promisePool.execute('SELECT * FROM files WHERE folder_id = ?', [req.params.folderId]);
        res.json({ success: true, data: rows });
    } catch (error) { res.status(500).send(); }
});

// API Ambil Semua Folder Milik User yang Login
app.get('/api/folders', async (req, res) => {
    // Cek apakah user sudah login melalui session
    if (!req.session.user) {
        return res.status(401).json({ success: false, message: 'Silakan login terlebih dahulu' });
    }

    try {
        // Ambil folder berdasarkan user_id yang ada di session
        const [rows] = await promisePool.execute(
            'SELECT * FROM folders WHERE user_id = ? ORDER BY created_at DESC',
            [req.session.user.id]
        );
        
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Gagal ambil folder:", error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data folder' });
    }
});

// API: Tambah Folder Baru
app.post('/api/folders', requireLogin, async (req, res) => {
    const { name } = req.body;
    
    // Cek apakah data nama ada
    if (!name) {
        return res.status(400).json({ success: false, message: 'Nama folder tidak boleh kosong' });
    }

    try {
        const userId = req.session.user.id; // Mengambil ID dari session login
        
        const [result] = await promisePool.execute(
            'INSERT INTO folders (user_id, name) VALUES (?, ?)',
            [userId, name]
        );

        console.log("Folder Berhasil Dibuat:", name); // Cek di terminal VS Code
        res.json({ success: true, message: 'Folder berhasil dibuat' });
    } catch (error) {
        console.error("DATABASE ERROR:", error.message); // Akan muncul di terminal jika SQL salah
        res.status(500).json({ success: false, message: 'Gagal simpan ke database: ' + error.message });
    }
});

// --- API EDIT FOLDER ---
app.put('/api/folders/:id', async (req, res) => {
    const { newName } = req.body;
    try {
        await promisePool.execute('UPDATE folders SET name = ? WHERE id = ?', [newName, req.params.id]);
        res.json({ success: true, message: 'Folder berhasil diubah' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- API HAPUS FOLDER ---
app.delete('/api/folders/:id', async (req, res) => {
    try {
        // Karena kita pakai ON DELETE CASCADE di database, isinya akan otomatis terhapus
        await promisePool.execute('DELETE FROM folders WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Folder berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- API HAPUS FILE ---
app.delete('/api/files/:id', async (req, res) => {
    try {
        await promisePool.execute('DELETE FROM files WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'File berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// --- API CATATAN (TASK) ---
// Hapus Catatan
app.delete('/api/contents/:id', async (req, res) => {
    try {
        await promisePool.execute('DELETE FROM contents WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Catatan berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus catatan' });
    }
});

app.post('/api/contents', async (req, res) => {
    const { folder_id, title, body, type } = req.body;
    try {
        // Gunakan folder_id (dengan underscore) sesuai pengiriman dari frontend
        await promisePool.execute(
            'INSERT INTO contents (folder_id, title, body, type) VALUES (?, ?, ?, ?)',
            [folder_id, title, body, type]
        );
        res.json({ success: true, message: 'Data tersimpan' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Edit Catatan
app.put('/api/contents/:id', async (req, res) => {
    const { title, body } = req.body;
    try {
        await promisePool.execute('UPDATE contents SET title = ?, body = ? WHERE id = ?', [title, body, req.params.id]);
        res.json({ success: true, message: 'Catatan berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal memperbarui catatan' });
    }
});

// Konfigurasi penyimpanan file di folder 'uploads'


// --- API UNTUK CATATAN/TUGAS (Tabel: contents) ---
// API: Simpan Catatan Baru
app.post('/api/contents', requireLogin, async (req, res) => {
    const { folder_id, title, body, type } = req.body;
    
    // Log untuk pengecekan di terminal VS Code
    console.log("Menerima Catatan Baru:", req.body);

    if (!folder_id || !title || !type) {
        return res.status(400).json({ success: false, message: 'Data tidak lengkap' });
    }

    try {
        await promisePool.execute(
            'INSERT INTO contents (folder_id, title, body, type) VALUES (?, ?, ?, ?)',
            [folder_id, title, body, type]
        );
        res.json({ success: true, message: 'Catatan berhasil disimpan' });
    } catch (error) {
        console.error("Database Error (Contents):", error.message);
        res.status(500).json({ success: false, message: 'Gagal simpan catatan' });
    }
});

// API: Ambil Catatan Berdasarkan Folder
app.get('/api/contents/:folderId', requireLogin, async (req, res) => {
    try {
        const [rows] = await promisePool.execute(
            'SELECT * FROM contents WHERE folder_id = ? ORDER BY created_at DESC',
            [req.params.folderId]
        );
        res.json({ success: true, data: rows });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal ambil data' });
    }
})


// --- API REGISTRASI (Simpan Akun Baru) ---

app.post('/api/register', async (req, res) => {
    const { username, password } = req.body;
    try {
        // Cek apakah user sudah ada
        const [rows] = await promisePool.execute('SELECT * FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
            return res.json({ success: false, message: 'Username sudah digunakan!' });
        }

        // Simpan user baru
        await promisePool.execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
        
        res.json({ success: true, message: 'Registrasi Berhasil!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Gagal mendaftar ke database.' });
    }
});

// --- API UNTUK UPLOAD FILE (Tabel: files) ---
// 'file' adalah nama field yang dikirim dari frontend
app.post('/api/upload', requireLogin, upload.single('file'), async (req, res) => {
    try {
        const { folder_id } = req.body;
        const file = req.file;

        if (!file) return res.status(400).json({ success: false, message: 'Tidak ada file' });

        await promisePool.execute(
            'INSERT INTO files (folder_id, file_name, file_path, file_type) VALUES (?, ?, ?, ?)',
            [folder_id, file.originalname, file.path, file.mimetype]
        );

        res.json({ success: true, message: 'File berhasil diunggah' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal proses upload' });
    }
});

app.get('/api/users', async (req, res) => {
    try {
        // Menggunakan query untuk mengambil id, username, dan password
        const [rows] = await promisePool.query('SELECT id, username, password FROM users');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error("Error Get Users:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Mengambil satu user berdasarkan ID (untuk keperluan Edit)
app.get('/api/users/:id', async (req, res) => {
    try {
        const [rows] = await promisePool.execute('SELECT id, username FROM users WHERE id = ?', [req.params.id]);
        if (rows.length > 0) {
            res.json({ success: true, data: rows[0] });
        } else {
            res.json({ success: false, message: 'User tidak ditemukan' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// API: Update User (Edit)
app.put('/api/users/:id', async (req, res) => {
    const { username, password } = req.body;
    try {
        if (password) {
            // Jika password diisi, update keduanya
            await promisePool.execute('UPDATE users SET username = ?, password = ? WHERE id = ?', [username, password, req.params.id]);
        } else {
            // Jika password kosong, update username saja
            await promisePool.execute('UPDATE users SET username = ? WHERE id = ?', [username, req.params.id]);
        }
        res.json({ success: true, message: 'User berhasil diperbarui' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal update: ' + error.message });
    }
});

// API: Hapus User
app.delete('/api/users/:id', async (req, res) => {
    try {
        await promisePool.execute('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'User berhasil dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus: ' + error.message });
    }
});

// --- ROUTES ---
app.get('/dashboard', requireLogin, (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Fallback ke Index
app.get('/', (req, res) => {
    if (req.session.user) return res.redirect('/dashboard');
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, async () => {
    console.log(`Server TaskJournal berjalan di http://localhost:${PORT}`);
    await testConnection();
});