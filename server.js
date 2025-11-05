const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// supaya bisa baca body JSON
app.use(express.json());

// arahkan Express ke folder "public"
app.use(express.static(path.join(__dirname, 'public')));

// data demo
const DEMO_USER = {
    username: 'admin@gmail.com',
    password: 'password123'
};

// endpoint login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username dan password wajib diisi' });
    }

    if (username === DEMO_USER.username && password === DEMO_USER.password) {
        return res.status(200).json({ success: true, message: 'Login berhasil' });
    } else {
        return res.status(401).json({ success: false, message: 'Username atau password salah' });
    }
});

// kirim file index.html saat root diakses
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});
