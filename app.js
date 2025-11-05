const { set } = require("express/lib/application");

const form = document.querySelector('@loginForm');
const messageBox = document.querySelector('#message');

function setMassege(text, type = 'info') {
    messageBox.textContent = text;
    messageBox.className = '';
    messageBox.classList.add('massege', type);
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMassege('Memproses...', 'info');

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        if (data.success) {
            setMassege(data.message || 'Login berhasil', 'success');
        } else {
            setMassege(data.message || 'Terjadi kesalahan', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        setMassege('Gagal menghubungi server', 'error');
    }
});