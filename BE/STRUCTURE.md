# 📁 Backend Project Structure

```
BE/
│
├── 📄 server.js              - File main, khởi động server Express
├── 📄 package.json           - Dependencies và scripts
├── 📄 .env                   - Biến môi trường (LOCAL)
├── 📄 .env.example           - Template cho .env
├── 📄 .gitignore             - File/folder không commit
│
├── 📋 README.md              - Tài liệu chính của backend
├── 📋 SETUP.md               - Hướng dẫn cài đặt và setup
├── 📋 STRUCTURE.md           - File này
├── 📄 API_TEST.rest          - Test API endpoints (dùng REST Client)
│
├── 📁 config/
│   ├── database.js           - Cấu hình kết nối MySQL
│   └── schema.sql            - SQL schema để tạo tables
│
├── 📁 middleware/
│   ├── auth.js               - JWT verification, checkAdmin
│   └── validator.js          - Validation rules (register, login, etc)
│
├── 📁 utils/
│   ├── helpers.js            - Helper functions (hash, JWT, responses)
│   └── constants.js          - Status codes, messages, constants
│
├── 📁 models/
│   ├── User.js               - User queries (create, get, update)
│   ├── Product.js            - Product queries (CRUD)
│   └── Order.js              - Order queries (CRUD)
│
├── 📁 controllers/
│   ├── authController.js     - Register, Login
│   ├── userController.js     - User endpoints
│   ├── productController.js  - Product endpoints
│   └── orderController.js    - Order endpoints
│
└── 📁 routes/
    ├── authRoutes.js         - /api/auth routes
    ├── userRoutes.js         - /api/users routes
    ├── productRoutes.js      - /api/products routes
    └── orderRoutes.js        - /api/orders routes
```

## 📊 File Dependencies

```
server.js
├── config/database.js
├── middleware/auth.js
├── routes/*Routes.js
│   ├── controllers/*Controller.js
│   │   ├── models/*.js
│   │   └── utils/helpers.js
│   ├── middleware/validator.js
│   └── middleware/auth.js
└── utils/constants.js
```

## 🔄 Request Flow

```
Client Request
    ↓
Express Router (routes/*.js)
    ↓
Middleware (auth.js, validator.js)
    ↓
Controller (controllers/*.js)
    ↓
Model (models/*.js)
    ↓
Database (MySQL)
    ↓
Response back to Client
```

## 🗂️ Database Schema

### Tables

- **users** - Lưu thông tin người dùng
- **products** - Lưu thông tin sản phẩm
- **orders** - Lưu đơn hàng
- **order_items** - Chi tiết items trong đơn hàng

### Relationships

```
users (1) ─────── (N) orders
                    │
                    └─── (N) order_items ─── (N) products
```

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Setup database
mysql -u root -p coffee_management < config/schema.sql

# 3. Configure .env

# 4. Run server
npm run dev
```

## 📡 API Endpoints Overview

| Method | Endpoint                   | Auth | Role  |
| ------ | -------------------------- | ---- | ----- |
| POST   | /api/auth/register         | ❌   | -     |
| POST   | /api/auth/login            | ❌   | -     |
| GET    | /api/users                 | ✅   | Admin |
| GET    | /api/users/profile/me      | ✅   | Any   |
| PUT    | /api/users/profile/update  | ✅   | Any   |
| GET    | /api/products              | ❌   | -     |
| POST   | /api/products              | ✅   | Admin |
| PUT    | /api/products/:id          | ✅   | Admin |
| DELETE | /api/products/:id          | ✅   | Admin |
| GET    | /api/orders/user/my-orders | ✅   | Any   |
| POST   | /api/orders                | ✅   | Any   |
| PUT    | /api/orders/:id/status     | ✅   | Admin |
| PUT    | /api/orders/:id/cancel     | ✅   | Any   |

## 🔐 Security Features

- ✅ Password hashing with bcryptjs
- ✅ JWT authentication
- ✅ Role-based access control (Admin/Customer)
- ✅ Input validation
- ✅ SQL parameterized queries (prevent SQL injection)
- ✅ Environment variables for sensitive data
- ✅ CORS enabled

## 📦 NPM Scripts

```bash
npm start      # Production mode
npm run dev    # Development mode with nodemon
npm test       # Run tests (nếu có)
```

## 🛠️ Technologies

- **Express.js** - Web framework
- **MySQL2** - Database driver
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Express Validator** - Input validation
- **dotenv** - Environment variables
- **CORS** - Cross-Origin Resource Sharing

---

Để lấy thông tin chi tiết, xem các file tương ứng hoặc SETUP.md!
