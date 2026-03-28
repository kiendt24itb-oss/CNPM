// API Status Codes
const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  SERVER_ERROR: 500,
};

// User Roles
const USER_ROLES = {
  ADMIN: "admin",
  CUSTOMER: "customer",
};

// Order Status
const ORDER_STATUS = {
  PENDING: "pending",
  CONFIRMED: "confirmed",
  PREPARING: "preparing",
  READY: "ready",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

// Product Categories
const PRODUCT_CATEGORIES = [
  "coffee",
  "tea",
  "juice",
  "smoothie",
  "cake",
  "sandwich",
  "other",
];

// Error Messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: "Bạn chưa đăng nhập",
  FORBIDDEN: "Bạn không có quyền truy cập",
  NOT_FOUND: "Không tìm thấy dữ liệu",
  INVALID_EMAIL: "Email không hợp lệ",
  PASSWORD_TOO_SHORT: "Mật khẩu phải ít nhất 6 ký tự",
  EMAIL_EXISTS: "Email đã tồn tại",
  INVALID_CREDENTIALS: "Email hoặc mật khẩu không đúng",
  SERVER_ERROR: "Lỗi server. Vui lòng thử lại sau",
};

// Success Messages
const SUCCESS_MESSAGES = {
  REGISTER_SUCCESS: "Đăng ký thành công",
  LOGIN_SUCCESS: "Đăng nhập thành công",
  CREATE_SUCCESS: "Tạo thành công",
  UPDATE_SUCCESS: "Cập nhật thành công",
  DELETE_SUCCESS: "Xóa thành công",
  FETCH_SUCCESS: "Lấy dữ liệu thành công",
};

module.exports = {
  STATUS_CODES,
  USER_ROLES,
  ORDER_STATUS,
  PRODUCT_CATEGORIES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
};
