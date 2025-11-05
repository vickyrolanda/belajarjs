const form = document.querySelector('#loginForm');
const messageBox = document.querySelector('#message');

function setMessage(text, type = 'info') {
  messageBox.textContent = text;
  messageBox.className = '';
  messageBox.classList.add('message', type);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  setMessage('Memproses...', 'info');

  const username = form.username.value.trim();
  const password = form.password.value.trim();

  // Validasi login langsung di frontend
  if (username === 'admin@gmail.com' && password === 'password123') {
    setTimeout(() => {
      setMessage('✅ Login berhasil! Selamat datang, Admin.', 'success');
      // Contoh aksi setelah login
      // window.location.href = 'dashboard.html';
    }, 800);
  } else {
    setTimeout(() => {
      setMessage('❌ Email atau password salah.', 'error');
    }, 800);
  }
});
