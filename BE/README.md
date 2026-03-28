# Coffee Management Backend

Backend API cho ứng dụng quản lý quán cà phê

## Cài đặt

```bash
npm install
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
- `POST /api/auth/refresh` - Refresh token

### Products (/api/products)

- `GET /api/products` - Lấy danh sách sản phẩm
- `GET /api/products/:id` - Lấy chi tiết sản phẩm
- `POST /api/products` - Thêm sản phẩm (Admin)
- `PUT /api/products/:id` - Cập nhật sản phẩm (Admin)
- `DELETE /api/products/:id` - Xóa sản phẩm (Admin)

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
