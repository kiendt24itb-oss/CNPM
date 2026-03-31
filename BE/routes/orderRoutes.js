const express = require("express");
const router = express.Router();
const OrderController = require("../controllers/OrderController");
const verifyToken = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

// Tất cả thao tác đơn hàng đều cần đăng nhập
router.use(verifyToken);

/**
 * NHÓM API HIỂN THỊ & LỌC (Dành cho cả STAFF và ADMIN)
 */

// 1. Lấy danh sách đơn hàng (Giao diện chính)
// Hỗ trợ query: ?status=ĐÃ THANH TOÁN hoặc ?search=Nguyễn Văn A
router.get("/", OrderController.getAll);

// 2. Xem chi tiết một đơn hàng (Nút "Chi tiết" ở giữa thẻ)
router.get("/:id", OrderController.getById);

/**
 * NHÓM API THAO TÁC (Phân quyền ADMIN cho việc Sửa/Xóa)
 */

// 3. Thêm đơn hàng mới (Nút "Thêm đơn" màu nâu góc trên trái)
router.post("/", OrderController.create);

// 4. Sửa đơn hàng (Biểu tượng Bút chì)
// Dùng khi cần đổi tên khách, số bàn hoặc thêm/bớt món
router.put("/:id", authorizeRole("ADMIN"), OrderController.updateStatus); // Có thể dùng chung hàm cập nhật

// 5. Xóa đơn hàng (Biểu tượng Thùng rác)
// Lưu ý: Chỉ nên cho xóa khi đơn ở trạng thái 'ĐANG XỬ LÝ' hoặc 'CHƯA THANH TOÁN'
router.delete("/:id", authorizeRole("ADMIN"), OrderController.cancel);

module.exports = router;
