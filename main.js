import { cekLogin, generateKeyCallback, tampilkanLaporanPromise } from './auth.js';

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('loginBtn').addEventListener('click', handleLogin);
});

function displayMessage(msg, color = 'black') {
    const msgElement = document.getElementById('message');
    msgElement.innerHTML = `Status: <strong>${msg}</strong>`;
    msgElement.style.backgroundColor = color === 'green' ? '#e9fbe9' : (color === 'red' ? '#fbe9e9' : '#eee');
    msgElement.style.color = color === 'green' ? '#4CAF50' : (color === 'red' ? '#e74c3c' : '#333');
}

function displayResult(res) {
    document.getElementById('result').innerHTML = res;
}

function handleLogin() {
    const usernameInput = document.getElementById('username').value.trim();
    const passwordInput = document.getElementById('password').value.trim();
    
    displayResult('');
    displayMessage('Memproses otentikasi...', 'gray');

    if (cekLogin(usernameInput)) {
        displayMessage('Login berhasil! Melanjutkan proses buat key (Callback)...', 'green');
        
        generateKeyCallback(usernameInput, (error, key) => {
            if (error) {
                displayMessage(`Gagal buat key: ${error.message}`, 'red');
                return;
            }
            
            displayMessage('Key tergenerate! Melanjutkan ke Laporan (Promise)...', 'orange');
            
            tampilkanLaporanPromise(key)
                .then(laporan => {
                    displayMessage('SEMUA PROSES ASINKRON SELESAI SUKSES!', 'blue');
                    displayResult(laporan); 
                })
                .catch(err => {
                    displayMessage(`Gagal Laporan: ${err.message}`, 'red');
                    displayResult(`Error saat memuat laporan: ${err.message}`);
                });
        });

    } else {
        displayMessage('Login gagal! Username/ID salah. Harusnya: admin', 'red');
    }
}