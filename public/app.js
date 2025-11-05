import { login } from './auth.js';
// Kita tidak lagi memerlukan generateKey atau getLaporan untuk alur ini
// import { generateKey } from './keyGenerator.js';
// import { getLaporan } from './laporan.js';

const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const statusDiv = document.getElementById('status');

loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = usernameInput.value;
    
    statusDiv.innerHTML = `<p>Mencoba login...</p>`;

    // Panggil fungsi login
    login(username)
      .then(userData => {
        // --- PERUBAHAN UTAMA DI SINI ---
        // Jika login berhasil (Promise di-resolve), arahkan ke halaman profil.
        // Kita kirim username sebagai parameter URL.
        console.log("Login berhasil, mengarahkan ke profil...");
        window.location.href = `/profile.html?username=${userData.username}`;
      })
      .catch(error => {
        // Jika login gagal, tetap tampilkan error di halaman login
        statusDiv.innerHTML = `<p style="color: red;"><b>Error:</b> ${error}</p>`;
      });
});