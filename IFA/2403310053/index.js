const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const DEMO_USER = {
    username: 'admin@gmail.com',
    password: 'password123'
};

app.post('/api/login', (req,res) => {
    const {username, password} = req.body || {};

    if (!username || !password) {
        res.status(400).json({message: 'Username dan password harus diisi'});
        console.log('harus diisi');
    }

    if (username === DEMO_USER.username && password === DEMO_USER.password) {
        res.status(200).json({message : 'Login berhasil'});
        console.log("Login Berhasil");
    } else {
        res.status(401).json({message: 'Username atau password salah'});
        console.log('Login gagal, username atau password salah');
    }
});

app.get ('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
})

app.listen(PORT, () => {
    console.log(`Server listening at port : ${PORT}`);
});