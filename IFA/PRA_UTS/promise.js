const express = require("express");
const path = require("path");
const session = require('express-session');

const app = express();


app.use(express.json());
app.use(express.static(__dirname));

app.use(
  session({
    secret: "session_key",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, 
  })
);


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/profile", (req, res) => {
    if (req.session.user) {
        res.sendFile(path.join(__dirname, "profile.html"));
    } else {
        res.redirect("/"); 
    }
});

app.post("/login", (req, res) => {
  const { username } = req.body;

  if (username === "admin") {
    req.session.user = { username };
    res.json({ success: true, message: "Login successful" });
  } else {
    res.json({ success: false, message: "No account found" });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ success: false, message: "Logout failed" });
    }
    res.clearCookie("connect.sid");
    res.json({ success: true, message: "Logged out" });
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
