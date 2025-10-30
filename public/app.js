const form = document.querySelector('#loginForm');
const messageBox = document.querySelector('#message');

function setMessage(text, type = 'info') {
    messageBox.textContent = text;
    messageBox.className = '';
    messageBox.classList.add('message', type);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setMessage('Memproses...', 'info');

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (response.ok) {
            setMessage(data.message || 'Login berhasil', 'success');
        } else {
            setMessage(data.message || 'Login gagal', 'error');
        }
    } catch (error) {
        setMessage('Terjadi kesalahan pada server.', 'error');
        console.error('Error during login:', error);
    }
});