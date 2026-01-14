document.getElementById('registerForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageDiv = document.getElementById('message');

    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (data.success) {
            messageDiv.style.color = "green";
            messageDiv.textContent = "Berhasil mendaftar! Mengalihkan ke halaman login...";
            
            // Pindah ke halaman login setelah 2 detik
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 2000);
        } else {
            messageDiv.style.color = "red";
            messageDiv.textContent = data.message;
        }
    } catch (error) {
        messageDiv.style.color = "red";
        messageDiv.textContent = "Terjadi kesalahan koneksi.";
    }
});