// public/js/user-management.js
let isEditMode = false;
let usersCache = [];

// Modal helpers
function openAddModal() {
  isEditMode = false;
  document.getElementById('modalTitle').textContent = 'Tambah User Baru';
  document.getElementById('userId').value = '';
  document.getElementById('username').value = '';
  document.getElementById('password').value = '';
  document.getElementById('userModal').style.display = 'block';
}

function closeModal() {
  document.getElementById('userModal').style.display = 'none';
}

// Handle form submit (tambah user)
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('userForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = document.getElementById('userId').value;
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      if (!username || !password) {
        alert('Username dan Password wajib diisi');
        return;
      }

      try {
        let resp, data;
        const id = document.getElementById('userId').value;
        if (id) {
          // update
          resp = await fetch('/api/users/' + id, {
            method: 'PUT',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          data = await resp.json();
        } else {
          // create
          resp = await fetch('/api/users', {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
          });
          data = await resp.json();
        }

        if (data.success) {
          alert(id ? 'User berhasil diupdate' : 'User berhasil ditambahkan');
          closeModal();
          loadUsers();
        } else {
          alert((data.message) || 'Gagal menyimpan user');
        }
      } catch (err) {
        console.error('Error saving user:', err);
        alert('Terjadi kesalahan saat menyimpan user.');
      }
    });
  }
});

// Load semua user saat halaman dimuat
async function loadUsers() {
  try {
    document.getElementById('loadingDiv').style.display = 'block';
    document.getElementById('userTable').style.display = 'none';
    document.getElementById('noDataDiv').style.display = 'none';

    const response = await fetch('/api/users', { credentials: 'same-origin' });
    const result = await response.json();

    if (result.success && Array.isArray(result.users) && result.users.length > 0) {
      displayUsers(result.users);
      document.getElementById('userTable').style.display = 'table';
    } else {
      document.getElementById('noDataDiv').style.display = 'block';
    }
  } catch (error) {
    console.error('Error loading users:', error);
    alert('Gagal memuat data user');
  } finally {
    document.getElementById('loadingDiv').style.display = 'none';
  }
}

// Tampilkan data user ke tabel
function displayUsers(users) {
  const tbody = document.getElementById('userTableBody');
  tbody.innerHTML = '';

  usersCache = users.slice();

  users.forEach(user => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${user.id}</td>
      <td>${user.username}</td>
      <td>${user.password ? user.password : '—'}</td>
      <td class="action-buttons">
        <button class="btn btn-warning btn-sm" onclick="editUser(${user.id})">Edit</button>
        <button class="btn btn-danger btn-sm" onclick="deleteUser(${user.id}, '${user.username}')">Hapus</button>
      </td>`;
    tbody.appendChild(row);
  });
}

function editUser(id) {
  const user = usersCache.find(u => u.id == id);
  if (!user) return alert('User tidak ditemukan');
  isEditMode = true;
  document.getElementById('modalTitle').textContent = 'Edit User';
  document.getElementById('userId').value = user.id;
  document.getElementById('username').value = user.username;
  document.getElementById('password').value = user.password || '';
  document.getElementById('userModal').style.display = 'block';
}

function deleteUser(id, username) {
  if (!confirm(`Hapus user ${username}?`)) return;
  fetch('/api/users/' + id, { method: 'DELETE', credentials: 'same-origin' })
    .then(r => r.json())
    .then(data => {
      if (data.success) {
        alert('User dihapus');
        loadUsers();
      } else {
        alert('Gagal menghapus user: ' + (data.message || 'unknown'));
      }
    })
    .catch(err => {
      console.error('Error deleting user:', err);
      alert('Terjadi kesalahan saat menghapus user.');
    });
}

// muat user saat halaman dibuka
document.addEventListener('DOMContentLoaded', loadUsers);
