const form = document.getElementById('loginForm');
const messageBox = document.getElementById('message');

function setMessage(text, type = 'info') {
  messageBox.textContent = text; //
  messageBox.className = ''; //
  messageBox.classList.add('message', type); //
}

// Fungsi baru untuk menampilkan data laporan
function displayReport(data) {
  // Buat elemen <pre> untuk menampilkan data JSON
  const pre = document.createElement('pre');
  pre.style.background = '#0b1020'; // Style dari CSS Anda
  pre.style.padding = '10px';
  pre.style.borderRadius = '8px';
  pre.style.marginTop = '10px';
  pre.style.borderColor = 'rgba(255,255,255,0.12)';
  pre.style.borderWidth = '1px';
  pre.style.borderStyle = 'solid';
  pre.textContent = JSON.stringify(data, null, 2); // Tampilkan JSON
  
  messageBox.appendChild(pre); // Tambahkan elemen ke kotak pesan
}

form.addEventListener('submit', async (e) => {
  e.preventDefault(); //
  setMessage('Memproses...', 'info'); //

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries()); //

  try {
    const res = await fetch('/api/login', {
      method: 'POST', //
      headers: { 'Content-Type': 'application/json' }, //
      body: JSON.stringify(payload) //
    });

    const data = await res.json();
    if (data.success) {
      setMessage(data.message || 'Login berhasil.', 'success');
      // Modifikasi: Tampilkan data laporan jika ada
      if (data.data) {
        displayReport(data.data);
      }
    } else {
      setMessage(data.message || 'Login gagal.', 'error'); //
    }
  } catch (err) {
    console.error(err); //
    setMessage('Terjadi kesalahan jaringan/server.', 'error'); //
  }
});