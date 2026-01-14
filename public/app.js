// ==========================================
// KODE APP.JS LENGKAP (Login, Register, Dashboard)
// ==========================================

// --- KONFIGURASI DAN SELEKTOR DOM (Login/Register) ---
const authForm = document.getElementById('authForm');
const messageBox = document.getElementById('message');
const toggleAuth = document.getElementById('toggleAuth');
const formTitle = document.querySelector('h1');
const submitBtn = document.querySelector('button[type="submit"]');
const toggleText = document.getElementById('toggleText');

// Status Mode (True = Login, False = Register)
let isLoginMode = true;

// ----------------------------------------------------------------
// BAGIAN 1: SISTEM AUTENTIKASI (Login & Register)
// ----------------------------------------------------------------

// Helper: Fungsi Menampilkan Pesan
function setMessage(text, type = 'info') {
    if (!messageBox) return; // Mencegah error jika elemen tidak ada
    messageBox.textContent = text;
    messageBox.className = ''; 
    messageBox.classList.add('message', type);
    
    // Styling manual untuk memastikan warna terlihat
    messageBox.style.color = type === 'success' ? 'green' : (type === 'error' ? 'red' : '#333');
    messageBox.style.marginTop = '15px';
    messageBox.style.fontWeight = 'bold';
}

// Logika Toggle (Pindah antara Login dan Daftar)
if (toggleAuth) {
    toggleAuth.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginMode = !isLoginMode;

        if (!isLoginMode) {
            // Ubah ke Tampilan Register
            if (formTitle) formTitle.textContent = "Daftar Akun Baru";
            if (submitBtn) submitBtn.textContent = "Buat Akun Sekarang";
            if (toggleText) toggleText.textContent = "Sudah punya akun?";
            toggleAuth.textContent = "Login di sini";
        } else {
            // Ubah ke Tampilan Login
            if (formTitle) formTitle.textContent = "TaskJournal";
            if (submitBtn) submitBtn.textContent = "Masuk ke Dashboard";
            if (toggleText) toggleText.textContent = "Belum punya akun?";
            toggleAuth.textContent = "Daftar Sekarang";
        }
        setMessage("", 'info'); // Bersihkan pesan lama
    });
}

// Logika Submit Form (Menangani Login & Register sekaligus)
if (authForm) {
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        setMessage('Sedang memproses...', 'info');

        const usernameInput = document.getElementById('username');
        const passwordInput = document.getElementById('password');

        if (!usernameInput || !passwordInput) return;

        const username = usernameInput.value;
        const password = passwordInput.value;

        // Tentukan URL tujuan berdasarkan mode
        const url = isLoginMode ? '/api/login' : '/api/register';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            // Validasi apakah server mengirim JSON (Mencegah error "<Unexpected token")
            const contentType = response.headers.get("content-type");
            if (!contentType || !contentType.includes("application/json")) {
                throw new Error("Respon server bukan JSON. Cek rute backend.");
            }

            const data = await response.json();

            if (data.success) {
                if (isLoginMode) {
                    // --- SKENARIO LOGIN SUKSES ---
                    setMessage('Login berhasil! Mengalihkan...', 'success');
                    setTimeout(() => {
                        window.location.href = data.redirect || 'dashboard.html';
                    }, 1000);
                } else {
                    // --- SKENARIO REGISTER SUKSES ---
                    setMessage('Registrasi Berhasil! Silakan Login.', 'success');
                    authForm.reset(); // Kosongkan form
                    setTimeout(() => { 
                        toggleAuth.click(); // Otomatis pindah ke mode login
                    }, 2000);
                }
            } else {
                // --- GAGAL (Password Salah / Username Kembar) ---
                setMessage(data.message || 'Terjadi kesalahan.', 'error');
            }
        } catch (error) {
            console.error("Auth Error:", error);
            setMessage('Gagal terhubung ke server.', 'error');
        }
    });
}

// ----------------------------------------------------------------
// BAGIAN 2: FITUR DASHBOARD (Folder, File, Konten)
// ----------------------------------------------------------------

// 1. Fungsi Logout
async function logout() {
    try {
        await fetch('/api/logout', { method: 'POST' });
        window.location.href = 'index.html';
    } catch (error) {
        console.error("Gagal logout", error);
        window.location.href = 'index.html'; // Paksa keluar meski error
    }
}

// 2. Fungsi Membuat Folder Baru
async function createFolder(name) {
    if (!name) return alert("Nama folder tidak boleh kosong");
    
    try {
        const response = await fetch('/api/folders', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name })
        });

        const result = await response.json();
        if (result.success) {
            alert('Folder berhasil dibuat!');
            location.reload(); // Refresh untuk memunculkan folder baru
        } else {
            alert('Gagal membuat folder: ' + result.message);
        }
    } catch (error) {
        console.error(error);
        alert('Gagal koneksi ke server.');
    }
}

// 3. Fungsi Menampilkan Daftar File (Load Files)
async function loadFiles(folderId) {
    const container = document.getElementById('fileList');
    // Guard clause: Jika elemen tidak ada (misal di halaman login), berhenti.
    if (!container) return; 

    try {
        const res = await fetch(`/api/files/${folderId}`);
        const result = await res.json();
        
        container.innerHTML = ''; // Bersihkan list lama

        if (result.success && result.data.length > 0) {
            result.data.forEach(file => {
                // Tentukan icon sederhana
                let icon = "📄";
                if (file.file_name.match(/\.(jpg|jpeg|png|gif)$/i)) icon = "🖼️";
                if (file.file_name.match(/\.(pdf)$/i)) icon = "📕";

                container.innerHTML += `
                    <div class="file-card" style="margin-bottom: 10px; padding: 10px; border: 1px solid #ddd; border-radius: 5px; background: #fff;">
                        <span style="margin-right:10px;">${icon} <strong>${file.file_name}</strong></span>
                        <a href="/${file.file_path}" target="_blank" style="color: blue; text-decoration: none;">Buka/Download</a>
                    </div>`;
            });
        } else {
            container.innerHTML = '<p style="color:#777;">Tidak ada file di folder ini.</p>';
        }
    } catch (error) {
        console.error("Gagal memuat file:", error);
        container.innerHTML = '<p style="color:red;">Error memuat file.</p>';
    }
}

async function fetchFolders() {
    const folderContainer = document.getElementById('folderList');
    if (!folderContainer) return;

    try {
        const response = await fetch('/api/folders');
        const result = await response.json();

        if (result.success) {
            folderContainer.innerHTML = ''; 

            result.data.forEach(folder => {
                // BAGIAN INI YANG MEMBUAT TOMBOL MUNCUL
                folderContainer.innerHTML += `
                    <div class="folder-item">
                        <div class="folder-card" onclick="loadFiles(${folder.id})" style="flex-grow: 1;">
                            📁 <span>${folder.name}</span>
                        </div>
                        <div class="folder-actions">
                            <button onclick="editFolder(${folder.id}, '${folder.name}')">✏️</button>
                            <button onclick="deleteFolder(${folder.id})">🗑️</button>
                        </div>
                    </div>
                `;
            });
        }
    } catch (error) {
        console.error("Gagal load folder:", error);
    }
}

// Panggil fungsi ini otomatis saat halaman dashboard terbuka
if (window.location.pathname.includes('dashboard.html')) {
    document.addEventListener('DOMContentLoaded', fetchFolders);
}

// 4. Fungsi Menampilkan Catatan/Tugas (Load Entries)
async function loadEntries(folderId) {
    const container = document.getElementById('contentList');
    if (!container) return;

    try {
        const res = await fetch(`/api/contents/${folderId}`);
        const result = await res.json();
        
        container.innerHTML = ''; 

        if (result.success && result.data.length > 0) {
            result.data.forEach(c => {
                const typeLabel = c.type === 'task' ? 'TASK' : 'JOURNAL';
                const typeColor = c.type === 'task' ? '#ffc107' : '#17a2b8'; // Kuning vs Biru
                
                container.innerHTML += `
                    <div class="entry-card" style="border:1px solid #eee; padding:15px; margin-bottom:10px; border-radius:8px; background: white;">
                        <span style="background:${typeColor}; color:black; padding:2px 6px; border-radius:4px; font-size:10px; font-weight:bold;">${typeLabel}</span>
                        <h4 style="margin: 5px 0;">${c.title}</h4>
                        <p style="color:#555; font-size:14px;">${c.body}</p>
                    </div>
                `;
            });
        } else {
            container.innerHTML = '<p style="text-align:center; color:#999;">Belum ada catatan.</p>';
        }
    } catch (error) {
        console.error("Gagal memuat entries:", error);
    }
}

// 5. Fungsi Menyimpan Catatan Baru
async function saveEntry(folderId, title, body, type) {
    if (!folderId) return alert("Pilih folder terlebih dahulu!");
    
    try {
        const res = await fetch('/api/contents', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                folder_id: folderId, 
                title: title, 
                body: body, 
                type: type 
            })
        });

        const result = await res.json();
        if (result.success) {
            alert("Berhasil disimpan!");
            loadEntries(folderId); // Refresh tampilan catatan
        } else {
            alert("Gagal menyimpan: " + result.message);
        }
    } catch (error) {
        console.error("Error saveEntry:", error);
        alert("Terjadi kesalahan saat menyimpan.");
    }
}

async function deleteFolder(id) {
    if (!confirm("Hapus folder ini? Isinya juga akan terhapus.")) return;
    const res = await fetch(`/api/folders/${id}`, { method: 'DELETE' });
    const result = await res.json();
    if (result.success) fetchFolders(); // Gambar ulang daftar folder
}

async function editFolder(id, oldName) {
    const newName = prompt("Nama folder baru:", oldName);
    if (!newName || newName === oldName) return;
    const res = await fetch(`/api/folders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newName })
    });
    const result = await res.json();
    if (result.success) fetchFolders();
}

// ==========================================
// AKHIR KODE APP.JS
// ==========================================