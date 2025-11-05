const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { tampilLaporan } = require("./module/laporan");

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Simulasi database login
const admin = {
  username: "admin",
  password: "12345",
};

// Rute login
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// Proses login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === admin.username && password === admin.password) {
    const laporanHTML = tampilLaporan(username);
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
          ${laporanHTML}
        </div>
      </body>
      </html>
    `);
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
