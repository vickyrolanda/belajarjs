const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { promisePool, testConnection } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3000;

// JWT Secret Key - Di production harus dari environment variable
const JWT_SECRET = 'belajarjs-jwt-secret-key-2026';
// Token expires in 24 hours
const JWT_EXPIRES_IN = '24h';

// Middleware
app.use(express.json());

// Serve static files from /public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware untuk verifikasi JWT token
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      success: false, 
      message: 'Access denied. Token tidak ditemukan.' 
    });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token tidak valid.' 
    });
  }
};

// Middleware untuk cek apakah user sudah login (untuk web interface)
const requireLogin = (req, res, next) => {
  // Untuk web interface, cek token dari localStorage di frontend
  // Redirect ke login page jika tidak ada token
  next(); // Sementara bypass untuk development
};

// Login endpoint dengan JWT token
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username dan password wajib diisi.' 
    });
  }

  try {
    // Query user dari database
    const [rows] = await promisePool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'Username tidak ditemukan.' 
      });
    }

    const user = rows[0];
    
    // Verifikasi password
    let passwordMatch = false;
    
    if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
      // Password sudah di-hash dengan bcrypt
      passwordMatch = await bcrypt.compare(password, user.password);
    } else {
      // Password masih plain text (untuk backward compatibility)
      passwordMatch = password === user.password;
      
      // Update password ke hashed version
      if (passwordMatch) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await promisePool.execute(
          'UPDATE users SET password = ? WHERE id = ?',
          [hashedPassword, user.id]
        );
      }
    }
    
    if (passwordMatch) {
      // Generate JWT token
      const token = jwt.sign(
        { 
          id: user.id, 
          username: user.username 
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );
      
      return res.status(200).json({ 
        success: true, 
        message: `Login berhasil! Selamat datang, ${user.username}`,
        token: token,
        user: {
          id: user.id,
          username: user.username
        },
        expiresIn: JWT_EXPIRES_IN
      });
    } else {
      return res.status(401).json({ 
        success: false, 
        message: 'Password salah.' 
      });
    }
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Terjadi kesalahan server. Silakan coba lagi.' 
    });
  }
});

// Endpoint logout (dengan JWT, logout dilakukan di frontend)
app.post('/api/logout', (req, res) => {
  // Dengan JWT, logout dilakukan di frontend dengan menghapus token
  // Server tidak perlu melakukan apa-apa
  res.json({ 
    success: true, 
    message: 'Logout berhasil. Silakan hapus token di client.' 
  });
});

// Endpoint untuk verify token dan get user info
app.get('/api/verify-token', verifyToken, (req, res) => {
  res.json({ 
    success: true,
    message: 'Token valid',
    user: {
      id: req.user.id,
      username: req.user.username
    }
  });
});

// Endpoint untuk refresh token (opsional)
app.post('/api/refresh-token', verifyToken, (req, res) => {
  // Generate new token
  const newToken = jwt.sign(
    { 
      id: req.user.id, 
      username: req.user.username 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
  
  res.json({ 
    success: true,
    message: 'Token refreshed',
    token: newToken,
    expiresIn: JWT_EXPIRES_IN
  });
});

// Route untuk dashboard (dilindungi dengan JWT di frontend)
app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

// Route untuk user management (dilindungi dengan JWT di frontend) 
app.get('/user-management', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'user-management.html'));
});

// GET - Ambil semua data user (dilindungi JWT)
app.get('/api/users', verifyToken, async (req, res) => {
  try {
    const [rows] = await promisePool.execute('SELECT id, username, created_at FROM users ORDER BY id DESC');
    res.json({ 
      success: true, 
      data: rows,
      message: 'Data users berhasil diambil'
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mengambil data user' 
    });
  }
});

// POST - Tambah user baru (dilindungi JWT)
app.post('/api/users', verifyToken, async (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username dan password wajib diisi' 
    });
  }
  
  try {
    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await promisePool.execute(
      'INSERT INTO users (username, password) VALUES (?, ?)',
      [username, hashedPassword]
    );
    
    res.status(201).json({ 
      success: true, 
      message: 'User baru berhasil ditambahkan',
      data: { id: result.insertId, username: username }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(400).json({ 
        success: false, 
        message: 'Username sudah digunakan' 
      });
    } else {
      console.error('Error adding user:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Gagal menambahkan user' 
      });
    }
  }
});

// GET - Ambil data user berdasarkan ID (dilindungi JWT)
app.get('/api/users/:id', verifyToken, async (req, res) => {
  try {
    const [rows] = await promisePool.execute(
      'SELECT id, username, created_at FROM users WHERE id = ?', 
      [req.params.id]
    );
    
    if (rows.length > 0) {
      res.json({ 
        success: true, 
        data: rows[0],
        message: 'Data user berhasil diambil'
      });
    } else {
      res.status(404).json({ 
        success: false, 
        message: 'User tidak ditemukan' 
      });
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Gagal mengambil data user' 
    });
  }
});

// PUT - Update user (dilindungi JWT)
app.put('/api/users/:id', verifyToken, async (req, res) => {
  const { username, password } = req.body;
  const userId = req.params.id;
  
  if (!username) {
    return res.status(400).json({ 
      success: false, 
      message: 'Username wajib diisi' 
    });
  }

  try {
    // Cek apakah username sudah digunakan oleh user lain
    const [existing] = await promisePool.execute(
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
      // Hash password baru
      const hashedPassword = await bcrypt.hash(password, 10);
      query = 'UPDATE users SET username = ?, password = ? WHERE id = ?';
      params = [username, hashedPassword, userId];
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

// DELETE - Hapus user (dilindungi JWT)
app.delete('/api/users/:id', verifyToken, async (req, res) => {
  const userId = req.params.id;

  // Cegah menghapus user yang sedang login
  if (req.user.id == userId) {
    return res.status(400).json({ 
      success: false, 
      message: 'Tidak dapat menghapus user yang sedang login' 
    });
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

// ===== END API CRUD USER MANAGEMENT =====

// Fallback to index.html for root
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, async () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
  
  // Test koneksi database saat server start
  await testConnection();
});
