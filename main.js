import { cekLogin, generateKeyCallback, tampilkanLaporanPromise } from '../auth.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
});

function displayMessage(msg, color = 'black') {
    const msgElement = document.getElementById('message');
    msgElement.innerHTML = `Status: <strong>${msg}</strong>`;
    msgElement.className = color;
}

function displayResult(res) {
    const result = document.getElementById('result');
    result.innerHTML = typeof res === 'object'
        ? `<pre>${JSON.stringify(res, null, 2)}</pre>`
        : res;
}

function handleLogin() {
    const username = document.getElementById('username').value.trim();

    displayResult('');
    displayMessage('Memproses otentikasi...', 'gray');

    if (cekLogin(username)) {
        displayMessage('Login berhasil! Membuat key...', 'green');

        generateKeyCallback(username, (error, key) => {
            if (error) return displayMessage(`Gagal buat key: ${error.message}`, 'red');

            displayMessage('Key berhasil! Membuat laporan...', 'orange');

            tampilkanLaporanPromise(key)
                .then(laporan => {
                    displayMessage('SEMUA PROSES SELESAI BERHASIL!', 'blue');
                    displayResult(laporan);
                })
                .catch(err => {
                    displayMessage(`Gagal memuat laporan: ${err.message}`, 'red');
                });
        });
    } else {
        displayMessage('Login gagal! Username salah (harus "admin").', 'red');
    }
}