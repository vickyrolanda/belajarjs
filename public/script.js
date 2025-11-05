document.getElementById("loginBtn").addEventListener("click", async () => {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const output = document.getElementById("output");
  output.style.color = "black";
  output.textContent = "Memeriksa...";

  try {
    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();

    if (data.success) {
      output.style.color = "green";
      output.innerHTML = `
        ${data.message}<br>
        Key: <b>${data.key}</b><br><br>
        <pre>${data.laporan}</pre>
      `;
    } else {
      callbackError(data.message);
    }
  } catch {
    callbackError("Koneksi ke server gagal.");
  }
});

function callbackError(pesan) {
  const output = document.getElementById("output");
  output.style.color = "red";
  output.textContent = pesan;
}
