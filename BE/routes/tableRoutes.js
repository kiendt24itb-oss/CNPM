const express = require("express");
const router = express.Router();
const TableController = require("../controllers/TableController");

// Import middleware của bạn
const verifyToken = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

/**
 * TẤT CẢ CÁC ROUTE DƯỚI ĐÂY ĐỀU YÊU CẦU ĐĂNG NHẬP (verifyToken)
 */
router.use(verifyToken);

// 1. Lấy danh sách tất cả các bàn (ADMIN và STAFF đều làm được)
router.get("/", TableController.getAllTables);

// 2. Tìm kiếm bàn theo khu vực (ADMIN và STAFF đều làm được)
router.get("/area/:area", TableController.getTablesByArea);

// 3. Cập nhật trạng thái bàn (Ví dụ: Chuyển từ Trống -> Đang dùng khi khách vào)
// Thường thì STAFF cũng cần quyền này để phục vụ khách
router.patch("/:id/status", TableController.updateTableStatus);

/**
 * CÁC ROUTE CHỈ DÀNH CHO ADMIN (THÊM, SỬA, XÓA)
 * Nhân viên (STAFF) sẽ bị chặn ở đây
 */

// Route Thêm bàn mới (Dùng chung giao diện như bạn mô tả)
router.post("/", authorizeRole("ADMIN"), (req, res) => {
  // Logic thêm bàn mới (Bạn cần bổ sung hàm createTable vào Controller)
  res.json({ message: "Admin đang tạo bàn mới" });
});

// Route Sửa thông tin bàn (Số bàn, Khu vực, Sức chứa)
router.put("/:id", authorizeRole("ADMIN"), (req, res) => {
  // Logic cập nhật thông tin (Bạn cần bổ sung hàm updateTable vào Controller)
  res.json({ message: `Admin đang sửa bàn ID: ${req.params.id}` });
});

// Route Xóa bàn
router.delete("/:id", authorizeRole("ADMIN"), (req, res) => {
  // Logic xóa bàn (Bạn cần bổ sung hàm deleteTable vào Controller)
  res.json({ message: `Admin đang xóa bàn ID: ${req.params.id}` });
});

module.exports = router;
