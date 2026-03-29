# Coffee Management Backend

Backend API cho ứng dụng quản lý quán cà phê

## Cài đặt

```bash
npm install
```

## Thiết lập Database

1. Cài đặt MySQL và tạo database:

```sql
CREATE DATABASE coffee_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. Import schema:

```bash
mysql -u root -p coffee_management < ../Database/coffee_management.sql
```

3. Import dữ liệu mẫu (tùy chọn):

```bash
mysql -u root -p coffee_management < ../Database/sample_data.sql
```

4. Cấu hình biến môi trường:

```bash
cp .env.example .env
# Chỉnh sửa .env với thông tin database của bạn
```

## Chạy server

```bash
# Development mode (với nodemon - tự restart khi thay đổi)
npm run dev

# Production mode
npm start
```

## Cấu trúc thư mục

```
BE/
├── config/           - File cấu hình kết nối database
├── controllers/      - Xử lý logic của các request
├── models/           - Định nghĩa model và hàm query database
├── routes/           - Định nghĩa các route API
├── middleware/       - Middleware (JWT, validation, ...)
├── utils/            - Các hàm tiện ích
├── server.js         - File chính chạy server
├── package.json      - Dependencies
└── .env              - Biến môi trường
```

## API Endpoints

### Authentication (/api/auth)

- `POST /api/auth/register` - Đăng ký tài khoản
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/google` - Đăng nhập Google

### Users (/api/users)

- `GET /api/users` - Lấy danh sách người dùng (Admin)
- `GET /api/users/profile/me` - Lấy thông tin cá nhân
- `GET /api/users/:id` - Lấy thông tin người dùng (Admin)
- `PUT /api/users/profile/update` - Cập nhật thông tin cá nhân
- `PUT /api/users/:id` - Cập nhật người dùng (Admin)
- `DELETE /api/users/:id` - Xóa người dùng (Admin)

### Products (/api/products)

- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/categories` - Lấy danh sách danh mục
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `GET /api/products/category/:categoryId` - Lấy sản phẩm theo danh mục
- `POST /api/products` - Thêm sản phẩm (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

### Orders (/api/orders)

- `GET /api/orders` - Lấy danh sách đơn hàng (Admin)
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng
- `GET /api/orders/user/me` - Lấy đơn hàng của tôi
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id/status` - Cập nhật trạng thái đơn hàng (Admin)
- `DELETE /api/orders/:id` - Hủy đơn hàng

### Tables (/api/tables)

- `GET /api/tables` - Lấy danh sách bàn
- `GET /api/tables/areas` - Lấy danh sách khu vực
- `GET /api/tables/:id` - Lấy chi tiết bàn
- `POST /api/tables` - Thêm bàn mới (Admin)
- `PUT /api/tables/:id` - Cập nhật bàn (Admin)
- `DELETE /api/tables/:id` - Xóa bàn (Admin)

### Orders (/api/orders)

- `GET /api/orders` - Lấy danh sách đơn hàng
- `GET /api/orders/:id` - Lấy chi tiết đơn hàng
- `POST /api/orders` - Tạo đơn hàng mới
- `PUT /api/orders/:id` - Cập nhật trạng thái đơn hàng
- `DELETE /api/orders/:id` - Hủy đơn hàng

### Users (/api/users)

- `GET /api/users` - Lấy danh sách người dùng (Admin)
- `GET /api/users/:id` - Lấy thông tin người dùng
- `PUT /api/users/:id` - Cập nhật thông tin người dùng
