const express = require("express");
const path = require("path");
const laporanAdmin = require("./report");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function verifikasiLogin(username, password, onSuccess, onError) {
  setTimeout(() => {
    if (username === "Admin" && password === "12345") {
      onSuccess("Login berhasil");
    } else {
      onError("Username atau password salah");
    }
  }, 1000);
}

function buatKey(username) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (username === "Admin") {
        const key = Math.random().toString(36).substring(2, 10);
        resolve(key);
      } else {
        reject("Gagal membuat key");
      }
    }, 1000);
  });
}

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  verifikasiLogin(
    username,
    password,
    async () => {
      try {
        const key = await buatKey(username);
        const laporan = laporanAdmin();
        res.json({ success: true, message: "Login berhasil", key, laporan });
      } catch (err) {
        res.status(500).json({ success: false, message: err });
      }
    },
    (errorMsg) => {
      res.status(401).json({ success: false, message: errorMsg });
    }
  );
});

app.listen(3000, () => console.log("Server berjalan di http://localhost:3000"));