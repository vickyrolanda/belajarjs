// Minimal client logic for PRA-UTS login and report demo
const form = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const logEl = document.getElementById('log');
const controls = document.getElementById('controls');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const user = usernameInput.value.trim();
  const pass = passwordInput.value;

  // Very small demo: accept any non-empty username/password
  if (!user || !pass) {
    log('Isi username dan password terlebih dahulu.', true);
    return;
  }

  // Simulate login success
  log(`Login berhasil. Selamat datang, ${user}!`);
  controls.style.display = 'block';
});

document.getElementById('reportBtn').addEventListener('click', () => {
  // Simple demo report shown in the log area
  const sample = [
    { id: 1, name: 'Siswa A', nilai: 88 },
    { id: 2, name: 'Siswa B', nilai: 75 },
    { id: 3, name: 'Siswa C', nilai: 92 }
  ];

  const rows = sample.map(r => `${r.id}. ${r.name} — ${r.nilai}`).join('\n');
  log('Laporan:\n' + rows);
});

function log(msg, isError = false) {
  logEl.textContent = msg;
  logEl.style.color = isError ? 'crimson' : '#222';
}

// Accessibility: put focus on username on load
usernameInput && usernameInput.focus();
