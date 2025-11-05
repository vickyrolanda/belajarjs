// public/app.js (atau file frontend yang memproses login)

// ... (kode DOM manipulation Anda di sini) ...

// Panggil endpoint /run-task menggunakan Fetch API
fetch('/run-task')
    .then(response => response.json())
    .then(data => {
        console.log("--- HASIL TUGAS DARI SERVER ---");
        // Logika Callback/Promise/Modul System sekarang muncul di browser console!
        data.logs.forEach(log => console.log(log)); 
        
        if (data.status === 'success') {
            console.log("STATUS: Tugas Node.js di Server Berhasil Dijalankan!");
        }
    })
    .catch(error => {
        console.error("Gagal terhubung ke server untuk menjalankan tugas.", error);
    });