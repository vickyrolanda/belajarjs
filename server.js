const express = require('express');
const path = require('path');
const crypto = require('crypto'); 
const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))

const DEMO_USER = {
    username: 'admin', 
    password: 'password123'
}

function checkCredentials(username, password, callback) {
    setTimeout(() => {
        if (username === DEMO_USER.username && password === DEMO_USER.password) {
            callback(null, { success: true, message: 'Login berhasil!', username: username });
        } else {
            callback(new Error('Username atau password salah'), null);
        }
    }, 300); 
}

function loginUser(username, password) {
    return new Promise((resolve, reject) => {
        checkCredentials(username, password, (error, data) => {
            if (error) {
                reject(error);
            } else {
                resolve(data);
            }
        });
    });
}

function generateKey(username) {
    return new Promise((resolve, reject) => {
        if (username !== 'admin') {
            return reject(new Error('Akses ditolak. Key generation hanya untuk admin.'));
        }
        setTimeout(() => {
            const uniqueKey = crypto.randomBytes(16).toString('hex');
            resolve(uniqueKey);
        }, 500);
    });
}

function generateReport(key) {
    if (!key) {
        throw new Error('Key tidak valid. Laporan tidak bisa dibuat.');
    }
    const reportData = {
        keyUsed: key,
        month: new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
        totalRevenue: 50000000, 
        currency: 'IDR'
    };
    return reportData;
}

app.post('/api/login', async (req, res) => { 
    const { username, password } = req.body || {};

    if (!username || !password) {
        return res.status(400).json({ success: false, message: 'Username dan password wajib di isi'});
    }

    try {
        const loginResult = await loginUser(username, password);

        if (loginResult.username !== 'admin') {
            return res.status(200).json({ 
                ...loginResult, 
                note: 'Login berhasil, namun key/laporan hanya untuk admin.' 
            });
        }

        const generatedKey = await generateKey(loginResult.username);

        const adminReport = generateReport(generatedKey);

        res.status(200).json({
            ...loginResult,
            key: generatedKey,
            report: adminReport,
            flow_status: 'SUCCESS: Login, Key, dan Laporan Admin selesai.'
        });

    } catch (error) {
        res.status(401).json({ 
            success : false, 
            message: error.message,
            flow_status: 'FAILED'
        });
    }
});

app.get ('/', (req, res) => {
    res.sendFile(path.join(__dirname,  'public', 'index.html'));
})

app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
});