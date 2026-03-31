const Ingredient = require("../models/Ingredient");

const IngredientController = {
  // 1. Lấy toàn bộ danh sách nguyên liệu trong kho
  getAllIngredients: async (req, res) => {
    try {
      const ingredients = await Ingredient.getAll();
      res.status(200).json({
        success: true,
        data: ingredients,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy danh sách nguyên liệu",
        error: error.message,
      });
    }
  },

  // 2. Cập nhật tồn kho (Nhập thêm hoặc Trừ bớt)
  // Body: { "quantity": 10 } (số dương để nhập, số âm để xuất)
  updateStock: async (req, res) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;

      if (quantity === undefined || isNaN(quantity)) {
        return res.status(400).json({
          success: false,
          message: "Số lượng (quantity) phải là một con số",
        });
      }

      const isUpdated = await Ingredient.updateStock(id, quantity);

      if (!isUpdated) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy nguyên liệu có ID này",
        });
      }

      res.status(200).json({
        success: true,
        message: "Cập nhật tồn kho thành công",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi cập nhật tồn kho",
        error: error.message,
      });
    }
  },

  // 3. Lấy danh sách nguyên liệu sắp hết hàng
  getLowStockAlert: async (req, res) => {
    try {
      const lowStockItems = await Ingredient.getLowStock();
      res.status(200).json({
        success: true,
        count: lowStockItems.length,
        data: lowStockItems,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi kiểm tra cảnh báo tồn kho",
        error: error.message,
      });
    }
  },
};

module.exports = IngredientController;
