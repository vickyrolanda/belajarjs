import express from 'express';
import bodyParser from 'body-parser';
import { cekLogin, generateKeyCallback, tampilkanLaporanPromise } from './auth.js';

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!cekLogin(username)) {
        return res.status(401).json({ success: false, message: 'Login gagal! Username/ID salah.' });
    }

    generateKeyCallback(username, (error, key) => {
        if (error) {
            return res.status(500).json({ success: false, message: 'Gagal membuat kunci keamanan.' });
        }

        tampilkanLaporanPromise(key)
            .then(laporan => {
                res.json({ 
                    success: true, 
                    message: 'Proses Asinkron Selesai Sukses!',
                    laporan: laporan 
                });
            })
            .catch(err => {
                res.status(500).json({ success: false, message: `Gagal memuat laporan: ${err.message}` });
            });
    });
});

app.listen(PORT, () => {
    console.log(`\nServer berjalan di http://localhost:${PORT}`);
    console.log(`Akses halaman login di: http://localhost:${PORT}/index.html`);
});