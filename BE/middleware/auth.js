const jwt = require("jsonwebtoken");

// Key này nên để trong file .env (ví dụ: JWT_SECRET=my_super_secret_key)
const SECRET_KEY = process.env.JWT_SECRET || "COFFEE_MANAGEMENT_SECRET_2024";

const verifyToken = (req, res, next) => {
  // 1. Lấy token từ header 'Authorization'
  // Định dạng thường là: "Bearer <token>"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // 2. Nếu không có token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Truy cập bị từ chối. Vui lòng đăng nhập!",
    });
  }

  try {
    // 3. Kiểm tra tính hợp lệ của token
    const decoded = jwt.verify(token, SECRET_KEY);

    // 4. Lưu thông tin user vào request để các middleware/controller sau sử dụng
    // decoded thường chứa: { user_id, username, role, email }
    req.user = decoded;

    next(); // Cho phép đi tiếp
  } catch (error) {
    return res.status(403).json({
      success: false,
      message: "Phiên đăng nhập hết hạn hoặc Token không hợp lệ!",
    });
  }
};

module.exports = verifyToken;
