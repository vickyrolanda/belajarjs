// public/app.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const statusDiv = document.getElementById('status');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password'); // Dapatkan input password

    // Fungsi untuk memperbarui div status
    function updateStatus(message, isSuccess = true) {
        statusDiv.innerHTML = `<p>${message}</p>`;
        statusDiv.style.backgroundColor = isSuccess ? '#d4edda' : '#f8d7da';
        statusDiv.style.color = isSuccess ? '#155724' : '#721c24';
    }

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Mencegah reload halaman
        
        const username = usernameInput.value;
        const password = passwordInput.value; // Ambil nilai password
        
        updateStatus("Sedang mencoba login...", false);

        try {
            // Mengirim data menggunakan Fetch API ke endpoint POST /login
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }), // Kirim username & password
            });

            const data = await response.json();

            if (response.ok) {
                // Login Berhasil
                const reportHtml = `
                    <h3> Login Berhasil</h3>
                    <p><strong>${data.message}</strong></p>
                    <p> Key Akses: <strong>${data.key}</strong></p>
                    <p> Laporan telah di-generate (lihat server log di terminal)</p>
                `;
                statusDiv.innerHTML = reportHtml;
                statusDiv.style.backgroundColor = '#d4edda';
                statusDiv.style.color = '#155724';
                console.log("--- Log dari Server ---");
                data.logs.forEach(log => console.log(`[SERVER LOG] ${log}`));
            } else {
                // Login Gagal
                updateStatus(` ${data.message}`, false);
                console.error("--- Error dari Server ---");
                data.logs.forEach(log => console.error(`[SERVER LOG] ${log}`));
            }
        } catch (error) {
            updateStatus("Terjadi error koneksi ke server.", false);
            console.error("Fetch Error:", error);
        }
    });
});