/**
 * Middleware phân quyền
 * @param {...String} allowedRoles - Danh sách các quyền được phép (ví dụ: 'ADMIN', 'STAFF')
 */
const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    // Kiểm tra xem middleware verifyToken đã chạy trước đó chưa
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Không tìm thấy thông tin xác thực!",
      });
    }

    // Kiểm tra xem role của user (req.user.role) có nằm trong danh sách cho phép không
    const hasPermission = allowedRoles.includes(req.user.role);

    if (!hasPermission) {
      return res.status(403).json({
        success: false,
        message: `Bạn không có quyền thực hiện hành động này! (Yêu cầu: ${allowedRoles.join(" hoặc ")})`,
      });
    }

    next(); // Có quyền thì cho đi tiếp
  };
};

module.exports = authorizeRole;
