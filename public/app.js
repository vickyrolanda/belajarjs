console.log("✅ app.js dimuat");

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

  const payload = {
    username: form.username.value.trim(),
    password: form.password.value.trim()
  };

  console.log("Payload dikirim:", payload);

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    console.log("Response server:", data);

    if (data.success) {
      setMessage(data.message || 'Login berhasil.', 'success');
    } else {
      setMessage(data.message || 'Username atau password salah.', 'error');
    }
  } catch (err) {
    console.error(err);
    setMessage('Gagal menghubungkan ke server.', 'error');
  }
});
