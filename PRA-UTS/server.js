const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { tampilLaporan } = require("./module/laporan");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Admin hardcode
const admin = {
  username: "admin",
  password: "12345",
};

// Fungsi generate key menggunakan Promise
function generateKey(username) {
  return new Promise((resolve, reject) => {
    if (username === admin.username) {
      const key = "KEY123"; // contoh key unik
      setTimeout(() => resolve(key), 500); // simulasi async
    } else {
      reject("Username tidak valid");
    }
  });
}

// Rute login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Proses login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === admin.username && password === admin.password) {
    // generate key (Promise)
    generateKey(username)
      .then((key) => {
        // key berhasil dibuat, panggil laporan dengan callback
        tampilLaporan(username, (laporanHTML) => {
          res.send(`
            <html>
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Laporan</title>
              <link rel="stylesheet" href="/style.css" />
            </head>
            <body>
              <div class="container">
                <p><strong>Key Admin:</strong> ${key}</p>
                ${laporanHTML}
              </div>
            </body>
            </html>
          `);
        });
      })
      .catch((err) => {
        res.send(`<div class="container"><h3>${err}</h3></div>`);
      });
  } else {
    res.send(`
      <div class="container">
        <h3>Login gagal! Username atau password salah.</h3>
        <a href="/">Kembali ke Login</a>
      </div>
    `);
  }
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
