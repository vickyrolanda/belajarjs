# 🔐 JWT Authentication - Belajar JavaScript Login System

## 📚 **Overview**
Implementasi sistem autentikasi menggunakan **JWT (JSON Web Token)** yang mudah dipahami untuk pembelajaran. Sistem ini mengganti session-based authentication dengan token-based authentication.

---

## 🆚 **Session vs JWT - Perbandingan**

### **Before (Session-based)**
```
Login → Create Session → Store in Server Memory → Return Session ID
Access → Check Session ID → Validate in Server → Grant/Deny Access
Logout → Destroy Session in Server
```

### **After (JWT Token-based)**
```
Login → Verify Credentials → Generate JWT Token → Return Token to Client
Access → Send Token in Header → Verify Token → Grant/Deny Access  
Logout → Delete Token from Client (Server stateless)
```

---

## 🎯 **Keunggulan JWT**

| Aspek | Session | JWT |
|-------|---------|-----|
| **Storage** | Server memory/database | Client-side (localStorage) |
| **Scalability** | Sulit (server state) | Mudah (stateless) |
| **Performance** | Database lookup | Local verification |
| **Mobile App** | Kompleks | Sederhana |
| **Cross-domain** | Limited | Flexible |

---

## 🔧 **Implementasi Detail**

### **1. Dependencies Baru**
```bash
npm install jsonwebtoken bcryptjs
```

- **jsonwebtoken**: Generate & verify JWT tokens
- **bcryptjs**: Hash passwords securely

### **2. JWT Configuration**
```javascript
// server.js
const JWT_SECRET = 'belajarjs-jwt-secret-key-2026';
const JWT_EXPIRES_IN = '24h';
```

### **3. Token Structure**
```
Header.Payload.Signature

eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.    // Header (Algorithm + Type)
eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyIn0.     // Payload (User data)
signature_hash_here                         // Signature (Verification)
```

### **4. Password Security**
- **Old**: Plain text storage ❌
- **New**: bcrypt hashing ✅
```javascript
// Hash password saat registrasi
const hashedPassword = await bcrypt.hash(password, 10);

// Verify saat login
const passwordMatch = await bcrypt.compare(password, user.password);
```

---

## 🚀 **Cara Menggunakan**

### **1. Start Server**
```bash
npm start
```
Server running di: http://localhost:3000

### **2. Login via Browser**
1. Buka http://localhost:3000
2. Login dengan: `user@example.com` / `password123`
3. Token akan disimpan di localStorage
4. Auto redirect ke dashboard

### **3. Login via API (Postman)**
```http
POST http://localhost:3000/api/login
Content-Type: application/json

{
  \"username\": \"user@example.com\",
  \"password\": \"password123\"
}
```

**Response:**
```json
{
  \"success\": true,
  \"message\": \"Login berhasil!\",
  \"token\": \"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...\",
  \"user\": { \"id\": 1, \"username\": \"user@example.com\" },
  \"expiresIn\": \"24h\"
}
```

### **4. Access Protected Endpoints**
```http
GET http://localhost:3000/api/users
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🔗 **API Endpoints**

### **Authentication**
- `POST /api/login` - Login & get token
- `GET /api/verify-token` - Verify token validity  
- `POST /api/refresh-token` - Refresh token
- `POST /api/logout` - Logout (client-side)

### **User Management (Protected)**
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

---

## 📁 **File Structure**

```
belajarjs/
├── server.js                    # Main server dengan JWT auth
├── config/
│   └── database.js              # Database configuration
├── public/
│   ├── index.html              # Login page
│   ├── app.js                  # Login logic
│   ├── dashboard.html          # Dashboard page
│   ├── jwt-auth.js             # JWT utility functions
│   └── styles.css              # Styling
├── JWT_API_DOCUMENTATION.md    # API documentation
├── JWT_Postman_Collection.json # Postman collection
└── package.json                # Dependencies
```

---

## 🧪 **Testing dengan Postman**

### **Import Collection**
1. Download: `JWT_Postman_Collection.json`
2. Import ke Postman
3. Set Environment variable `baseUrl` = `http://localhost:3000`

### **Testing Flow**
1. **Login** → Get token (auto-saved)
2. **Verify Token** → Check validity
3. **Get Users** → Test protected endpoint
4. **Create User** → Test POST with auth
5. **Update/Delete** → Test other CRUD operations

### **Error Testing**
- Access without token → 401 Unauthorized
- Invalid token → 401 Unauthorized  
- Expired token → 401 Unauthorized
- Duplicate username → 400 Bad Request

---

## 🔐 **Security Features**

### **1. Password Hashing**
```javascript
// Automatic upgrade dari plain text ke bcrypt
if (user.password.startsWith('$2a$') || user.password.startsWith('$2b$')) {
  // Already hashed
  passwordMatch = await bcrypt.compare(password, user.password);
} else {
  // Plain text - upgrade to hash
  passwordMatch = password === user.password;
  if (passwordMatch) {
    const hashedPassword = await bcrypt.hash(password, 10);
    await updateUserPassword(hashedPassword);
  }
}
```

### **2. Token Expiration**
- Default: 24 hours
- Configurable via `JWT_EXPIRES_IN`
- Auto-check di frontend setiap 5 menit

### **3. Secure Headers**
```javascript
Authorization: Bearer <token>
```

### **4. Client-side Protection**
```javascript
// Auto redirect jika tidak ada token
if (!auth.isAuthenticated()) {
  window.location.href = '/';
}
```

---

## 🎓 **Learning Points**

### **JWT Concepts**
- **Stateless**: Server tidak menyimpan session
- **Self-contained**: Token berisi semua info user
- **Portable**: Bisa digunakan di multiple services
- **Secure**: Signed dengan secret key

### **Frontend Integration**
- localStorage untuk persistent storage
- Authorization header untuk API calls
- Auto token verification
- Session management

### **Backend Security**
- Password hashing dengan bcrypt
- Token verification middleware
- Protected endpoints
- Error handling

---

## 🚨 **Production Considerations**

### **Security Enhancements**
```javascript
// 1. Use environment variables
const JWT_SECRET = process.env.JWT_SECRET;

// 2. Shorter expiration time
const JWT_EXPIRES_IN = '1h';

// 3. Refresh token implementation
// 4. Rate limiting
// 5. HTTPS only
// 6. Secure cookie storage
```

### **Database Security**
- Parameterized queries (✅ sudah implemented)
- Input validation
- SQL injection prevention
- Connection pooling

---

## 📖 **Resources**

- [JWT.io](https://jwt.io/) - JWT debugger
- [bcrypt online](https://bcrypt-generator.com/) - Password hash tester
- [Postman](https://postman.com/) - API testing tool

---

## ✅ **Quick Test Checklist**

### Browser Testing
- [ ] Login dengan credentials valid
- [ ] Token tersimpan di localStorage  
- [ ] Redirect ke dashboard berhasil
- [ ] Logout menghapus token
- [ ] Direct access dashboard tanpa login → redirect

### API Testing  
- [ ] POST `/api/login` → return token
- [ ] GET `/api/verify-token` dengan token valid
- [ ] GET `/api/users` dengan Authorization header
- [ ] POST `/api/users` create user baru
- [ ] Error handling untuk invalid token

---

## 🎯 **Next Steps**

1. **Refresh Token**: Implementasi refresh token untuk security
2. **Role-based Access**: Admin vs User permissions  
3. **Password Reset**: Forget password functionality
4. **Email Verification**: Account verification
5. **Two-Factor Auth**: Additional security layer

---

**Selamat! Sistem JWT Authentication sudah berhasil diimplementasikan! 🚀**

*Created by: AI Assistant | Date: 7 January 2026*