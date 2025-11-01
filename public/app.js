const form = document.querySelector('#loginForm');
const messageBox = document.querySelector('#message');

function setMessage(text, type = 'info') {
    messageBox.textContent = text;
    messageBox.className = '';
    messageBox.classList.add('message', type);
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    setMessage('Memproses...', 'info');

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
            setMessage(data.message, 'success');
        } else {
            setMessage(data.message, 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        setMessage('Gagal terhubung ke server', 'error');
    }
});