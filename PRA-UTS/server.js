const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const querystring = require('querystring');

class LoginServer {
    constructor(port = 3000) {
        this.port = port;
        this.server = http.createServer(this.handleRequest.bind(this));
        this.setupRoutes();
    }

    setupRoutes() {
        this.routes = {
            '/': 'login.html',
            '/login': 'login.html',
            '/api/login': this.handleLogin.bind(this),
            '/api/laporan': this.handleLaporan.bind(this),
            '/api/validate-key': this.handleValidateKey.bind(this)
        };
    }

    handleRequest(req, res) {
        const parsedUrl = url.parse(req.url, true);
        const pathname = parsedUrl.pathname;

        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(200);
            res.end();
            return;
        }

        console.log(`${new Date().toISOString()} - ${req.method} ${pathname}`);

        // Handle API routes
        if (pathname.startsWith('/api/')) {
            const routeHandler = this.routes[pathname];
            if (routeHandler && typeof routeHandler === 'function') {
                routeHandler(req, res, parsedUrl);
            } else {
                this.sendError(res, 404, 'API endpoint not found');
            }
            return;
        }

        // Serve static files
        this.serveStaticFile(req, res, pathname);
    }

    serveStaticFile(req, res, pathname) {
        let filePath = pathname === '/' ? 'login.html' : pathname.slice(1);
        
        // Security: Prevent directory traversal
        filePath = path.join(__dirname, filePath);
        if (!filePath.startsWith(__dirname)) {
            this.sendError(res, 403, 'Forbidden');
            return;
        }

        const extname = path.extname(filePath).toLowerCase();
        const contentTypes = {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'text/javascript',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.gif': 'image/gif',
            '.ico': 'image/x-icon'
        };

        const contentType = contentTypes[extname] || 'text/plain';

        fs.readFile(filePath, (err, data) => {
            if (err) {
                if (err.code === 'ENOENT') {
                    this.sendError(res, 404, 'File not found');
                } else {
                    this.sendError(res, 500, 'Server error');
                }
            } else {
                res.writeHead(200, { 'Content-Type': contentType });
                res.end(data, 'utf8');
            }
        });
    }

    handleLogin(req, res, parsedUrl) {
        if (req.method !== 'POST') {
            this.sendError(res, 405, 'Method not allowed');
            return;
        }

        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                const { username, password } = JSON.parse(body);
                
                // Simulasi validasi login dengan Promise
                this.validateLogin(username, password)
                    .then(result => {
                        this.sendJson(res, 200, result);
                    })
                    .catch(error => {
                        this.sendJson(res, 401, { error: error.message });
                    });
            } catch (error) {
                this.sendError(res, 400, 'Invalid JSON data');
            }
        });
    }

    validateLogin(username, password) {
        return new Promise((resolve, reject) => {
            // Simulasi delay database
            setTimeout(() => {
                const adminCredentials = {
                    username: "admin",
                    password: "password123"
                };

                if (username === adminCredentials.username && password === adminCredentials.password) {
                    const sessionKey = this.generateSessionKey();
                    resolve({
                        success: true,
                        message: "Login berhasil!",
                        key: sessionKey,
                        timestamp: new Date().toISOString()
                    });
                } else {
                    reject(new Error("Username atau password salah!"));
                }
            }, 1500);
        });
    }

    generateSessionKey() {
        return "ADM-" + Math.random().toString(36).substr(2, 9).toUpperCase() + "-" + Date.now().toString(36);
    }

    handleLaporan(req, res, parsedUrl) {
        if (req.method !== 'GET') {
            this.sendError(res, 405, 'Method not allowed');
            return;
        }

        // Validasi key dari query parameter
        const key = parsedUrl.query.key;
        if (!key || !this.validateKey(key)) {
            this.sendJson(res, 401, { error: 'Invalid or missing key' });
            return;
        }

        // Simulasi pengambilan data laporan dengan callback
        this.getLaporanData((error, data) => {
            if (error) {
                this.sendJson(res, 500, { error: 'Failed to get report data' });
            } else {
                this.sendJson(res, 200, data);
            }
        });
    }

    validateKey(key) {
        // Validasi sederhana - dalam production gunakan JWT atau session management
        return key && key.startsWith('ADM-') && key.length > 10;
    }

    getLaporanData(callback) {
        // Simulasi delay database/API
        setTimeout(() => {
            const penghasilanData = {
                bulan: ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus"],
                penghasilan: [8500000, 9200000, 7800000, 10500000, 9500000, 11000000, 9800000, 11200000],
                timestamp: new Date().toISOString(),
                summary: {
                    total: 0,
                    rata_rata: 0,
                    tertinggi: { bulan: "", nilai: 0 },
                    terendah: { bulan: "", nilai: 0 }
                }
            };

            // Hitung statistik
            const total = penghasilanData.penghasilan.reduce((sum, val) => sum + val, 0);
            const rata_rata = Math.round(total / penghasilanData.penghasilan.length);
            const maxIndex = penghasilanData.penghasilan.indexOf(Math.max(...penghasilanData.penghasilan));
            const minIndex = penghasilanData.penghasilan.indexOf(Math.min(...penghasilanData.penghasilan));

            penghasilanData.summary.total = total;
            penghasilanData.summary.rata_rata = rata_rata;
            penghasilanData.summary.tertinggi = {
                bulan: penghasilanData.bulan[maxIndex],
                nilai: penghasilanData.penghasilan[maxIndex]
            };
            penghasilanData.summary.terendah = {
                bulan: penghasilanData.bulan[minIndex],
                nilai: penghasilanData.penghasilan[minIndex]
            };

            callback(null, penghasilanData);
        }, 1000);
    }

    handleValidateKey(req, res, parsedUrl) {
        if (req.method !== 'GET') {
            this.sendError(res, 405, 'Method not allowed');
            return;
        }

        const key = parsedUrl.query.key;
        const isValid = this.validateKey(key);

        this.sendJson(res, 200, {
            valid: isValid,
            key: key,
            timestamp: new Date().toISOString()
        });
    }

    sendJson(res, statusCode, data) {
        res.writeHead(statusCode, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data, null, 2));
    }

    sendError(res, statusCode, message) {
        this.sendJson(res, statusCode, { error: message });
    }

    start() {
        this.server.listen(this.port, () => {
            console.log(`🚀 Server berjalan di http://localhost:${this.port}`);
            console.log(`📁 Menyajikan file dari: ${__dirname}`);
            console.log(`🔑 Login dengan: username="admin", password="password123"`);
            console.log(`⏹️  Tekan Ctrl+C untuk menghentikan server`);
        });

        this.server.on('error', (error) => {
            console.error('❌ Server error:', error);
        });
    }

    stop() {
        this.server.close(() => {
            console.log('🛑 Server dihentikan');
        });
    }
}

// Handle process termination
process.on('SIGINT', () => {
    console.log('\n🛑 Menghentikan server...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n🛑 Menghentikan server...');
    process.exit(0);
});

// Start server if this file is run directly
if (require.main === module) {
    const port = process.env.PORT || 3000;
    const server = new LoginServer(port);
    server.start();
}

module.exports = LoginServer;