# Backend Setup Guide

## 📋 Yêu cầu

- Node.js v14+
- MySQL 5.7+ hoặc MariaDB
- npm hoặc yarn

## 🚀 Hướng dẫn cài đặt

### 1. Clone hoặc download project

```bash
cd BE
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình Database

- Tạo database MySQL với tên `coffee_management`
- Import file `config/schema.sql` vào database

```bash
mysql -u root -p coffee_management < config/schema.sql
```

### 4. Cấu hình biến môi trường

```bash
# Copy file .env.example thành .env
cp .env.example .env

# Sửa file .env với thông tin database của bạn
```

### 5. Chạy server

```bash
# Development mode (tự restart khi thay đổi code)
npm run dev

# Production mode
npm start
```

Server sẽ chạy tại `http://localhost:3000`

## 📚 API Endpoints

### 🔐 Authentication

```
POST /api/auth/register     - Đăng ký (không cần token)
POST /api/auth/login        - Đăng nhập (không cần token)
```

### 👥 Users

```
GET  /api/users                - Lấy tất cả users (Admin)
GET  /api/users/profile/me     - Lấy profile người dùng hiện tại
GET  /api/users/:id            - Lấy thông tin user (Admin)
PUT  /api/users/profile/update - Cập nhật profile
```

### ☕ Products

```
GET    /api/products              - Lấy tất cả sản phẩm
GET    /api/products/:id          - Lấy chi tiết sản phẩm
GET    /api/products/category/:category - Lấy sản phẩm theo danh mục
POST   /api/products              - Tạo sản phẩm (Admin)
PUT    /api/products/:id          - Cập nhật sản phẩm (Admin)
DELETE /api/products/:id          - Xóa sản phẩm (Admin)
```

### 📦 Orders

```
GET  /api/orders                     - Lấy tất cả đơn hàng (Admin)
GET  /api/orders/user/my-orders      - Lấy đơn hàng của tôi
GET  /api/orders/:id                 - Lấy chi tiết đơn hàng
POST /api/orders                     - Tạo đơn hàng
PUT  /api/orders/:id/status          - Cập nhật trạng thái (Admin)
PUT  /api/orders/:id/cancel          - Hủy đơn hàng
```

## 🔑 Authentication

Tất cả request (trừ register/login) cần header:

```
Authorization: Bearer <your_jwt_token>
```

## 📂 Cấu trúc Folder

- `config/` - Configuration (database, schema)
- `controllers/` - Request handlers
- `models/` - Database queries
- `routes/` - API routes
- `middleware/` - Auth, validation
- `utils/` - Helper functions
- `server.js` - Main server file

## 🐛 Troubleshooting

### Cannot connect to database

- Kiểm tra MySQL đang chạy
- Kiểm tra thông tin DB trong file .env
- Kiểm tra database `coffee_management` đã tạo

### Port 3000 already in use

```bash
npm run dev -- --port 3001
```

### Dependencies not installed

```bash
rm package-lock.json
npm install
```

## 📝 Notes

- JWT Token mặc định hết hạn sau 7 ngày
- Passwords được hash với bcryptjs
- Sử dụng soft delete cho products (deletedAt)
- Orders lưu items dạng JSON

---

Có câu hỏi? Liên hệ developer!
