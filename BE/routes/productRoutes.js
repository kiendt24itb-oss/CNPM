const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const verifyToken = require("../middleware/auth");
const authorizeRole = require("../middleware/role");

// Tất cả thao tác với sản phẩm đều cần đăng nhập
router.use(verifyToken);

// 1. Lấy danh sách sản phẩm (Dùng cho cả Staff và Admin)
// API này nên trả về thêm thông tin "Tổng số món" và "Món bán chạy"
router.get("/", ProductController.getAllProducts);

// 2. Lấy chi tiết 1 sản phẩm (Dùng khi ấn nút 'Xem')
router.get("/:id", ProductController.getProductById);

// --- NHÓM QUYỀN ADMIN (Thêm, Sửa, Xóa) ---

// 3. Thêm sản phẩm mới (Nút 'Thêm sản phẩm')
router.post("/", authorizeRole("ADMIN"), ProductController.createProduct);

// 4. Cập nhật sản phẩm (Nút 'Sửa')
router.put("/:id", authorizeRole("ADMIN"), (req, res) => {
  // Bạn cần bổ sung hàm updateProduct vào Controller sau
  res.json({ message: `Đang cập nhật sản phẩm ${req.params.id}` });
});

// 5. Xóa sản phẩm (Nút 'Xoá')
router.delete("/:id", authorizeRole("ADMIN"), (req, res) => {
  // Bạn cần bổ sung hàm deleteProduct vào Controller sau
  res.json({ message: `Đã xóa sản phẩm ${req.params.id}` });
});

module.exports = router;
