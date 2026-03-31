const express = require("express");
const router = express.Router();
const CategoryController = require("../controllers/CategoryController");
const verifyToken = require("../middleware/auth");

// Yêu cầu đăng nhập để thấy danh mục lọc
router.get("/", verifyToken, CategoryController.getAllCategories);

/** * Vì bạn nói không thêm/sửa/xóa từ giao diện nên
 * mình không khai báo các route POST/PUT/DELETE ở đây.
 */

module.exports = router;
