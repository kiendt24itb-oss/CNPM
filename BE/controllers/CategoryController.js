const Category = require("../models/Category"); // Đảm bảo đường dẫn này đúng với file model của bạn

const CategoryController = {
  // 1. Lấy tất cả danh mục
  getAllCategories: async (req, res) => {
    try {
      const categories = await Category.getAll();
      res.status(200).json({
        success: true,
        data: categories,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy danh sách danh mục",
        error: error.message,
      });
    }
  },

  // 2. Tạo danh mục mới
  createCategory: async (req, res) => {
    try {
      const { category_name } = req.body;

      if (!category_name) {
        return res.status(400).json({
          success: false,
          message: "Tên danh mục không được để trống",
        });
      }

      const newId = await Category.create(category_name);
      res.status(201).json({
        success: true,
        message: "Tạo danh mục thành công",
        categoryId: newId,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi tạo danh mục",
        error: error.message,
      });
    }
  },

  // 3. Xóa danh mục
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const isDeleted = await Category.delete(id);

      if (!isDeleted) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy danh mục để xóa",
        });
      }

      res.status(200).json({
        success: true,
        message: "Xóa danh mục thành công",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi xóa danh mục",
        error: error.message,
      });
    }
  },
};

module.exports = CategoryController;
