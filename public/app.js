const form = document.getElementById('loginForm');
const messageBox = document.getElementById('message');

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
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.success) {
      setMessage(data.message || 'Login berhasil.', 'success');
    } else {
      setMessage(data.message || 'Login gagal.', 'error');
    }
  } catch (err) {
    console.error(err);
    setMessage('Terjadi kesalahan jaringan/server.', 'error');
  }
});
