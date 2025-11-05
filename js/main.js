// Main module untuk integrasi semua proses
import { checkLogin } from './auth.js';
import { generateKey } from './keygen.js';
import { generateReport } from './report.js';

// DOM elements
const form = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const reportBtn = document.getElementById('reportBtn');
const logEl = document.getElementById('log');
const controls = document.getElementById('controls');

let activeKey = null;

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const username = usernameInput.value.trim();
    const password = passwordInput.value;
    
    try {
        log('Memeriksa kredensial...');
        
        // Proses 1: Login
        const loginResult = await checkLogin(username, password);
        log(`${loginResult.message}`);
        
        // Proses 2: Generate Key
        log('Generating security key...');
        const keyResult = await generateKey(username);
        activeKey = keyResult.key;
        log('Key berhasil di-generate!');
        
        // Tampilkan kontrol laporan
        controls.style.display = 'block';
        
    } catch (error) {
        log(error.message || 'Terjadi kesalahan', true);
        controls.style.display = 'none';
    }
});

// Proses 3: Tampilkan Laporan (hanya bisa diakses setelah punya key)
reportBtn.addEventListener('click', async () => {
    if (!activeKey) {
        log('Anda harus login terlebih dahulu', true);
        return;
    }
    
    try {
        log('Mengambil data laporan...');
        const report = await generateReport(activeKey);
        
        // Format laporan untuk ditampilkan
        const formattedReport = `
Laporan Penghasilan - ${report.periode}
================================
Total Penghasilan: Rp ${report.penghasilan.total.toLocaleString()}

Rincian:
${report.penghasilan.rincian.map(item => 
    `- ${item.kategori}: Rp ${item.jumlah.toLocaleString()}`
).join('\n')}
`;
        log(formattedReport);
        
    } catch (error) {
        log(error.message || 'Gagal mengambil laporan', true);
    }
});

function log(msg, isError = false) {
    logEl.textContent = msg;
    logEl.style.color = isError ? 'crimson' : '#222';
}

// Focus username field on load
usernameInput.focus();