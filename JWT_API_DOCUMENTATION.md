# 🚀 JWT API Documentation - Belajar JS Login System

## 📚 **Overview**
Sistem login menggunakan JWT (JSON Web Token) untuk authentication. Token harus disertakan dalam header Authorization untuk mengakses endpoint yang dilindungi.

---

## 🔐 **Authentication Flow**

### 1. **Login** → Get JWT Token
### 2. **Include Token** → Dalam setiap API call
### 3. **Token Verification** → Server verify token
### 4. **Access Granted/Denied** → Based on token validity

---

## 📍 **Base URL**
```
http://localhost:3000
```

---

## 🔑 **Authentication Endpoints**

### **1. LOGIN - Get JWT Token**
```http
POST /api/login
```

**Request Body:**
```json
{
  "username": "user@example.com",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Login berhasil! Selamat datang, user@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "user@example.com"
  },
  "expiresIn": "24h"
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Username tidak ditemukan."
}
```

### **2. VERIFY TOKEN**
```http
GET /api/verify-token
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token valid",
  "user": {
    "id": 1,
    "username": "user@example.com"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Token tidak valid."
}
```

### **3. REFRESH TOKEN**
```http
POST /api/refresh-token
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Token refreshed",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "24h"
}
```

### **4. LOGOUT**
```http
POST /api/logout
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Logout berhasil. Silakan hapus token di client."
}
```

---

## 👥 **User Management Endpoints (Protected)**

**⚠️ All user management endpoints require JWT token in Authorization header**

### **5. GET ALL USERS**
```http
GET /api/users
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Success Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "username": "user@example.com",
      "created_at": "2026-01-07T10:30:00.000Z"
    },
    {
      "id": 2,
      "username": "admin@example.com",
      "created_at": "2026-01-07T10:31:00.000Z"
    }
  ],
  "message": "Data users berhasil diambil"
}
```

### **6. GET USER BY ID**
```http
GET /api/users/:id
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example:**
```http
GET /api/users/1
```

**Success Response (200):**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "username": "user@example.com",
    "created_at": "2026-01-07T10:30:00.000Z"
  },
  "message": "Data user berhasil diambil"
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "User tidak ditemukan"
}
```

### **7. CREATE NEW USER**
```http
POST /api/users
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "newuser@example.com",
  "password": "newpassword123"
}
```

**Success Response (201):**
```json
{
  "success": true,
  "message": "User baru berhasil ditambahkan",
  "data": {
    "id": 3,
    "username": "newuser@example.com"
  }
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Username sudah digunakan"
}
```

### **8. UPDATE USER**
```http
PUT /api/users/:id
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "updateduser@example.com",
  "password": "newpassword123"
}
```
*Note: Password is optional. If not provided, only username will be updated.*

**Success Response (200):**
```json
{
  "success": true,
  "message": "User berhasil diupdate"
}
```

### **9. DELETE USER**
```http
DELETE /api/users/:id
```

**Headers:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Example:**
```http
DELETE /api/users/3
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "User berhasil dihapus"
}
```

**Error Response (400) - Cannot delete self:**
```json
{
  "success": false,
  "message": "Tidak dapat menghapus user yang sedang login"
}
```

---

## 🧪 **Testing dengan Postman**

### **Step 1: Login dan Get Token**
1. Create new request: `POST http://localhost:3000/api/login`
2. Set Body → raw → JSON:
   ```json
   {
     "username": "user@example.com", 
     "password": "password123"
   }
   ```
3. Send request
4. **Copy the token** from response

### **Step 2: Set Authorization Header**
Untuk semua protected endpoints:
1. Go to Headers tab
2. Add key: `Authorization`
3. Value: `Bearer YOUR_TOKEN_HERE`

**Example:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ1c2VyQGV4YW1wbGUuY29tIiwiaWF0IjoxNzA0NjI2NDAwLCJleHAiOjE3MDQ3MTI4MDB9.signature_here
```

### **Step 3: Test Protected Endpoints**
1. **Verify Token**: `GET /api/verify-token`
2. **Get Users**: `GET /api/users`
3. **Create User**: `POST /api/users`
4. **Update User**: `PUT /api/users/1`
5. **Delete User**: `DELETE /api/users/3`

---

## 🔧 **Postman Environment Setup**

Create Postman Environment variables:
- **baseUrl**: `http://localhost:3000`
- **authToken**: `{{token}}` (will be set dynamically)

### **Auto-extract Token Script**
Add this to your login request's Tests tab:
```javascript
// Auto extract token from login response
if (pm.response.to.have.status(200)) {
    const responseJson = pm.response.json();
    if (responseJson.success && responseJson.token) {
        pm.environment.set("authToken", responseJson.token);
        console.log("Token saved:", responseJson.token);
    }
}
```

Then use `{{authToken}}` in Authorization headers for other requests.

---

## 🚨 **Common Error Responses**

### **401 Unauthorized - Invalid/Missing Token**
```json
{
  "success": false,
  "message": "Access denied. Token tidak ditemukan."
}
```

### **401 Unauthorized - Token Expired**
```json
{
  "success": false,
  "message": "Token tidak valid."
}
```

### **400 Bad Request - Missing Fields**
```json
{
  "success": false,
  "message": "Username dan password wajib diisi"
}
```

### **500 Internal Server Error**
```json
{
  "success": false,
  "message": "Terjadi kesalahan server. Silakan coba lagi."
}
```

---

## 📋 **Postman Collection Import**

Create a collection file (`jwt-api-collection.json`):
```json
{
  "info": {
    "name": "JWT API - Belajar JS",
    "description": "Collection for testing JWT authentication API"
  },
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:3000",
      "type": "string"
    },
    {
      "key": "authToken",
      "value": "",
      "type": "string"
    }
  ],
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\\n  \\"username\\": \\"user@example.com\\",\\n  \\"password\\": \\"password123\\"\\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "login"]
            }
          }
        }
      ]
    }
  ]
}
```

---

## 🎯 **Testing Scenarios**

### **1. Happy Path**
- ✅ Login with valid credentials
- ✅ Get token
- ✅ Access protected endpoints
- ✅ Perform CRUD operations

### **2. Error Cases**
- ❌ Login with invalid credentials
- ❌ Access protected endpoint without token
- ❌ Access with expired token
- ❌ Create user with duplicate username
- ❌ Delete non-existent user

### **3. Security Tests**
- 🔒 Verify token expiration
- 🔒 Test malformed tokens
- 🔒 Test role-based access (if implemented)

---

## ⚙️ **Server Configuration**

Make sure your server is running:
```bash
npm start
```

**Default users for testing:**
- Username: `user@example.com`, Password: `password123`
- Username: `admin@example.com`, Password: `admin123`

---

**Created by: AI Assistant | Date: 7 January 2026**  
**Version**: 1.0  
**JWT Implementation**: Simple & Educational Purpose**