const form = document.getElementById('loginForm');
const messageBox = document.getElementById('message');

function setMessage(text, type = 'info') {
  messageBox.textContent = text;
  messageBox.className = '';
  messageBox.classList.add('message', type);
}

// Check if user already logged in
document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('authToken');
  if (token) {
    // Verify token validity
    verifyTokenAndRedirect(token);
  }
});

async function verifyTokenAndRedirect(token) {
  try {
    const response = await fetch('/api/verify-token', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      // Token valid, redirect to dashboard
      window.location.href = '/dashboard';
    } else {
      // Token invalid, remove from storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  }
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
      
      // Simpan JWT token dan user info
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect ke dashboard setelah 1 detik
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } else {
      setMessage(data.message || 'Login gagal.', 'error');
    }
  } catch (err) {
    console.error(err);
    setMessage('Terjadi kesalahan jaringan/server.', 'error');
  }
});
