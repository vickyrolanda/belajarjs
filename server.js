const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const { promisePool, testConnection } = require('./config/database');
const session = require('express-session');

app.use(express.json());

app.use(session({
  secret: 'belajarjs-secret-key-2025',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000,
    httpOnly: true
  }
}));

app.use(express.static(path.join(__dirname, 'public')));

const requireLogin = (req, res, next) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  next();
};

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(200).json({ success: false, message: 'Username dan password wajib diisi' });
  }

  try {
    const [rows] = await promisePool.execute(
      'SELECT * FROM users WHERE username = ? AND password = ?',
      [username, password]
    );

  if (rows.length > 0) {
    const user = rows[0];

    req.session.user = {
      id: user.id,
      username: user.username,
      name: user.name
    };

    req.session.save((err) => {
      if (err) {
        return res.status(500).json({ success: false, message: 'Gagal membuat sesi login' });
      }
      return res.status(200).json({
        success: true,
        message: `Login berhasil! Selamat datang, ${user.username}.`,
        redirect: '/dashboard'
      });
    });
  } else {
    return res.status(200).json({
      success: false,
      message: 'Login gagal! Username atau password salah.'
    });
  }
  } catch (error) {
    console.error('Database error', error);
    return res.status(500).json({
      success: false,
      message: 'Terjadi kesalahan pada server. Silakan coba lagi.'
    });
  }
});

app.post('/api/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Gagal logout' });
    }
    res.json({ success: true, message: 'Logout berhasil' });
  });
});

app.get('/api/check-session', (req, res) => {
  if (req.session.user) {
    res.json({ loggedIn: true, user: req.session.user });
  } else {
    res.json({ loggedIn: false });
  }
});

app.get('/dashboard', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/user-management', requireLogin, (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'user-management.html'));
});

app.post('/api/users', requireLogin, async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(200).json({ success: false, message: 'Semua field wajib diisi' });
    }

    try {
      const [existing] = await promisePool.execute('SELECT id FROM users WHERE username = ?', [username]);

      if (existing.length > 0) {
        return res.status(400).json({ success: false, message: 'Username sudah digunakan' });
      }

      const [result] = await promisePool.execute(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [username, password]
      );

      res.json({
        success: true,
        message: 'User berhasil ditambahkan',
        data : { id: result.insertId, username }
      });
    } catch (error) {
      console.error('Error creating user', error);
      res.status(500).json({ success: false, message: 'Gagal menambahkan pengguna' });
    }
});

app.get('/api/users', requireLogin, async (req, res) => {
    try {
        const [rows] = await promisePool.execute('SELECT id, username, password FROM users ORDER BY id DESC');
        res.json({ success: true, data: rows });
    } catch (error) {
        console.error('Error fetching users', error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data pengguna' });
    }
});

// GET - Ambil data user berdasarkan ID
app.get('/api/users/:id', requireLogin, async (req, res) => {
    try {
        const [rows] = await promisePool.execute('SELECT id, username, password FROM users WHERE id = ?', [req.params.id]);

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

// PUT - Update user
app.put('/api/users/:id', requireLogin, async (req, res) => {
    const { username, password } = req.body;
    const userId = req.params.id;

    if (!username) {
        return res.status(400).json({ success: false, message: 'Username wajib diisi' });
    }

    try {
        // Cek apakah username sudah digunakan oleh user lain
        const [existing] = await promisePool.execute(
            'SELECT id FROM users WHERE username = ? AND id != ?',
            [username, userId]
        );

        if (existing.length > 0) {
            return res.status(400).json({ success: false, message: 'Username sudah digunakan oleh user lain' });
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

        const [result] = await promisePool.execute(query, params);

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
app.delete('/api/users/:id', requireLogin, async (req, res) => {
    const userId = req.params.id;

    // Cegah menghapus user yang sedang login
    if (req.session.user && req.session.user.id == userId) {
        return res.status(400).json({ success: false, message: 'Tidak dapat menghapus user yang sedang login' });
    }

    try {
        const [result] = await promisePool.execute('DELETE FROM users WHERE id = ?', [userId]);

        if (result.affectedRows > 0) {
            res.json({ success: true, message: 'User berhasil dihapus' });
        } else {
            res.status(404).json({ success: false, message: 'User tidak ditemukan' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ success: false, message: 'Gagal menghapus user' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html')); 
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
    testConnection();
});