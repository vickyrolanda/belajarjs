function login(username, password, callback) {
    console.log("Memeriksa data login...");

    setTimeout(() => {
        if (username === "admin" && password === "123") {
            callback(null, username);
        } else {
            callback("Username atau password salah!");
        }
    }, 1000);
}

function createKeyPromise(username) {
    return new Promise((resolve, reject) => {
        console.log("Membuat key...");

        setTimeout(() => {
            if (username) {
                const key = `${username}_${Date.now()}`;
                resolve(key);
            } else {
                reject("Gagal membuat key!");
            }
        }, 1000);
    });
}

document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    const formBox = document.querySelector(".form-box");
    formBox.innerHTML = "<p>Memproses login...</p>";

    login(username, password, async (err, user) => {
        if (err) {
            formBox.innerHTML = `<p style="color:red;">${err}</p>`;
            return;
        }

        try {
            const key = await createKeyPromise(user);
            console.log("Key:", key);

            const res = await fetch(`/api/report?username=${user}&key=${key}`);
            const data = await res.json();

            formBox.innerHTML = `
                <h2>Login Berhasil</h2>
                <p><strong>Key:</strong> ${key}</p>
                <p>${data.report}</p>
            `;
        } catch (error) {
            formBox.innerHTML = `<p style="color:red;">${error}</p>`;
        }
    });
});
