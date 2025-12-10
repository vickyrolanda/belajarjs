const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session'); // WAJIB DIINSTALL: npm install express-session
const db = require('./db'); // Import koneksi database

const app = express();
const PORT = process.env.PORT || 3000; // Port server Anda

// --- Middleware ---
// Menggunakan body-parser untuk membaca data dari form HTML
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); 

// Mengatur session middleware
// Pastikan secret adalah string acak yang kuat dan disimpan di variabel lingkungan
app.use(session({
    secret: 'kunciRahasiaYangSangatKuatDanAcak', // Ganti dengan string acak yang SANGAT kuat di produksi
    resave: false, // Jangan menyimpan ulang session jika tidak ada perubahan
    saveUninitialized: false, // Jangan membuat session baru jika belum ada data yang disimpan
    cookie: { 
        secure: false, // Set true jika situs Anda menggunakan HTTPS
        maxAge: 1000 * 60 * 60 * 24 // Session berlaku 1 hari (dalam milidetik)
    } 
}));

    // Middleware untuk melindungi route (cek session login)
    function requirelogin(req, res, next) {
        if (req.session && req.session.loggedIn) {
            return next();
        }
        // Jika request mengharapkan JSON (API), kirim 401 JSON
        const acceptsJson = req.headers.accept && req.headers.accept.indexOf('application/json') !== -1;
        if (acceptsJson || req.path.startsWith('/api')) {
            return res.status(401).json({ status: 'failed', message: 'Anda harus login terlebih dahulu.' });
        }
        // Untuk request biasa (browser), redirect ke halaman login
        return res.redirect('/?error=Anda_harus_login_terlebih_dahulu');
    }

// Mengatur folder 'public' sebagai tempat file statis (HTML, CSS, JS frontend)
// Pastikan folder 'public' ada di dalam folder '2403310049.html'
app.use(express.static(path.join(__dirname, 'public'))); 

// --- Rute Aplikasi ---

// Rute Home (untuk menyajikan index.html)
app.get('/', (req, res) => {
    // Jika sudah login, redirect ke dashboard
    if (req.session.loggedIn) {
        return res.redirect( '/dashboard.html'); // Mengarahkan ke dashboard.html
    }
    // Jika belum login, sajikan halaman login (index.html)
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rute untuk memproses login (menerima data dari form)
app.post('/login', (req, res) => {
    // Ambil username dan password dari body permintaan POST
    // Gunakan .trim() untuk menghilangkan spasi di awal/akhir input
    const username = req.body.username ? req.body.username.trim() : '';
    const password = req.body.password ? req.body.password.trim() : '';

    // --- DEBUGGING: Lihat apa yang diterima dari form ---
    console.log('--- LOGIN ATTEMPT ---');
    console.log('Username dari form:', username);
    console.log('Password dari form:', password);
    // ----------------------------------------------------

    // Validasi input sederhana
    if (!username || !password) {
        // Menggunakan query parameter untuk pesan error yang lebih spesifik
        return res.redirect('/?error=Username_dan_password_harus_diisi');
    }

    // Query SQL menggunakan Prepared Statements untuk mencegah SQL Injection
    // Mengambil id, username, dan password dari tabel users
    const query = 'SELECT id, username, password FROM users WHERE username = ?';
    
    // Gunakan db.execute() untuk menjalankan prepared statement
    db.execute(query, [username], (err, results) => {
        if (err) {
            console.error('Error saat query database:', err);
            // Menggunakan query parameter untuk pesan error
            return res.redirect('/?error=Terjadi_kesalahan_server_database');
        }

        if (results.length > 0) {
            // User ditemukan di database
            const user = results[0];
            
            // --- DEBUGGING: Lihat apa yang diambil dari database ---
            console.log('User ditemukan di DB:', user.username);
            console.log('Password dari DB:', user.password);
            console.log('Membandingkan password:', password, 'dengan', user.password);
            // ----------------------------------------------------

            // Verifikasi password
            // CATATAN PENTING: Untuk aplikasi nyata, JANGAN PERNAH menyimpan password plain text di DB.
            // Gunakan bcrypt.compare(password, user.password) untuk memverifikasi password yang di-hash.
            if (password === user.password) { 
                // Login berhasil
                console.log(`User ${username} berhasil login!`);
                req.session.loggedIn = true; // Set status login di session
                req.session.username = user.username; // Simpan username di session
                req.session.userId = user.id; // Simpan ID user di session

                res.redirect('/dashboard.html'); // Redirect ke halaman dashboard
            } else {
                // Password salah
                console.log(`Percobaan login gagal: Password salah untuk username ${username}`);
                return res.redirect('/?error=Password_salah'); // Pesan error lebih spesifik
            }
        } else {
            // Username tidak ditemukan
            console.log(`Percobaan login gagal: Username ${username} tidak ditemukan`);
            return res.redirect('/?error=Username_tidak_ditemukan'); // Pesan error lebih spesifik
        }
    });
});

// Rute untuk halaman dashboard (memerlukan login)
app.get('/dashboard.html', (req, res) => {
    if (req.session.loggedIn) {
        // Jika sudah login, sajikan dashboard
        res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
    } else {
        // Jika belum login, redirect kembali ke halaman login
        res.redirect('/?error=Anda_harus_login_terlebih_dahulu');
    }
});

// Rute untuk logout
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Error saat menghancurkan session:', err);
            return res.redirect('/dashboard.html?error=Gagal_logout');
        }
        res.redirect('/?message=Berhasil_logout'); // Redirect ke halaman login dengan pesan sukses
    });
});

app.get('/dashboard', requirelogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Router untuk user management
app.get('/user-management', requirelogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user-management.html'));
});

// Get - ambil semua data user
app.get('/api/users', requirelogin, async (req, res) => {
    try {
        const [rows] = await db.promise().execute('SELECT id, username, password FROM users ORDER BY id DESC');
        res.json({ success: true, users: rows });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data user.' });
    }
});

// POST - tambah user baru (dilindungi)
app.post('/api/users', requirelogin, async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) return res.status(400).json({ success: false, message: 'Username dan password wajib diisi.' });

        // Cek username unik
        const [existing] = await db.promise().execute('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Username sudah digunakan.' });
        }

        // Insert menggunakan prepared statement
        const [result] = await db.promise().execute('INSERT INTO users (username, password) VALUES (?, ?)', [username, password]);
        // Ambil user yang baru dibuat
        const insertId = result.insertId;
        const [rows] = await db.promise().execute('SELECT id, username FROM users WHERE id = ?', [insertId]);
        return res.json({ success: true, user: rows[0] });
    } catch (err) {
        console.error('Error creating user:', err);
        return res.status(500).json({ success: false, message: 'Gagal membuat user.' });
    }
});

// GET - Ambil data user berdasarkan ID
app.get('/api/users/:id', requirelogin, async (req, res) => {
    try {
        const [rows] = await db.promise().execute(
            'SELECT id, username, password FROM users WHERE id = ?',
            [req.params.id]
        );

        if (rows.length > 0) {
            res.json({ success: true, data: rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data user' });
    }
});

// PUT - update user
app.put('/api/users/:id', requirelogin, async (req, res) => {
    const { username, password } = req.body;
    const userId = req.params.id;

    if (!username) {
        return res.status(400).json({ success: false, message: 'Username wajib diisi' });
    }

    try {
        // Cek apakah username sudah digunakan user lain
        const [existing] = await db.promise().execute(
            'SELECT id FROM users WHERE username = ? AND id != ?',
            [username, userId]
        );

        if (existing.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Username sudah digunakan oleh user lain'
            });
        }

        // Update dengan atau tanpa password
        let query, params;

        if (password && password.trim() !== '') {
            query = 'UPDATE users SET username = ?, password = ? WHERE id = ?';
            params = [username, password, userId];
        } else {
            query = 'UPDATE users SET username = ? WHERE id = ?';
            params = [username, userId];
        }

        const [result] = await db.promise().execute(query, params);

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'User berhasil diupdate' });
        } else {
            res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ success: false, message: 'Gagal mengupdate user' });
    }
});

// DELETE - Hapus user
app.delete('/api/users/:id', requirelogin, async (req, res) => {
    const userId = req.params.id;

    // Cegah menghapus user yang sedang login
    if (req.session.userId && req.session.userId == userId) {
        return res.status(400).json({
            success: false,
            message: 'Tidak dapat menghapus user yang sedang login'
        });
    }

    try {
        const [result] = await db.promise().execute(
            'DELETE FROM users WHERE id = ?',
            [userId]
        );

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'User berhasil dihapus' });
        } else {
            res.status(404).json({
                success: false,
                message: 'User tidak ditemukan'
            });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Gagal menghapus user'
        });
    }
});

// Start server
app.listen(PORT, () => {
    console.log(`Server Express berjalan di http://localhost:${PORT}`);
    console.log('Buka browser Anda dan navigasi ke alamat tersebut.');
});

// ... (Kode server.js Anda sebelumnya)

// Rute API untuk mendapatkan informasi session
app.get('/api/session-info', (req, res) => {
    if (req.session.loggedIn) {
        res.json({
            loggedIn: true,
            username: req.session.username,
            userId: req.session.userId,
            sessionId: req.session.id
        });
    } else {
        res.json({
            loggedIn: false
        });
    }
});

// ... (Sisa kode server.js Anda, termasuk app.listen())