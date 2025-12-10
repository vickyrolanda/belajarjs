import { generateKey } from './keyGenerator.js';
import { getLaporan } from './laporan.js';

function initProfile() {
    // Ambil elemen DOM
    const welcomeMessageEl = document.getElementById('welcomeMessage');
    const detailsDiv = document.getElementById('details');

    // Baca username dari parameter URL
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('username');

    if (!username) {
        welcomeMessageEl.textContent = 'Akses Ditolak!';
        detailsDiv.innerHTML = '<p style="color: red;">Data pengguna tidak ditemukan. Silakan login kembali.</p>';
        return; // Hentikan eksekusi jika tidak ada username
    }

    // 1. Tampilkan pesan selamat datang segera
    welcomeMessageEl.textContent = `Selamat Datang, ${username}!`;
    detailsDiv.innerHTML = '<p>Memuat data profil...</p>';

    // Buat objek pengguna tiruan untuk diteruskan ke fungsi selanjutnya
    const userData = { uid: 'xyz123', username: username };

    // --- Rantai Promise Dimulai di Halaman Profil ---

    // 2. Proses Generate Key
    generateKey(userData)
        .then(apiKey => {
            // Tampilkan hasil pembuatan kunci
            detailsDiv.innerHTML = `<p><strong>Kunci Akses:</strong> ${apiKey}</p>`;
            detailsDiv.innerHTML += '<p>Mengambil laporan penghasilan...</p>';

            // 3. Proses Get Laporan (setelah key berhasil dibuat)
            return getLaporan(apiKey);
        })
        .then(laporanData => {
            // Tampilkan hasil laporan
            detailsDiv.innerHTML += `<p><strong>Laporan:</strong> ${laporanData}</p>`;
        })
        .catch(error => {
            // Tangkap error dari proses manapun
            detailsDiv.innerHTML += `<p style="color: red;"><b>Gagal memuat data:</b> ${error}</p>`;
        });
}

// Jalankan fungsi inisialisasi
initProfile();
