const Recipe = require("../models/Recipe");
const RecipeDetail = require("../models/RecipeDetail");

const RecipeController = {
  // ==========================================
  // NHÓM 1: QUẢN LÝ CHUNG CÔNG THỨC (RECIPES)
  // ==========================================

  // 1. Lấy danh sách tất cả công thức (Chỉ tên và ghi chú)
  getAllRecipes: async (req, res) => {
    try {
      const recipes = await Recipe.getAll();
      res.status(200).json({ success: true, data: recipes });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "Lỗi lấy danh sách",
          error: error.message,
        });
    }
  },

  // 2. Xem chi tiết 1 công thức (Gồm thông tin món + mảng nguyên liệu)
  getRecipeDetail: async (req, res) => {
    try {
      const { id } = req.params;
      const details = await Recipe.getDetail(id); // Giả sử hàm này trong model đã JOIN 2 bảng

      if (!details || details.length === 0) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy công thức" });
      }
      res.status(200).json({ success: true, data: details });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "Lỗi lấy chi tiết",
          error: error.message,
        });
    }
  },

  // 3. Tạo trọn bộ công thức mới (Tên món + List nguyên liệu)
  createRecipe: async (req, res) => {
    try {
      const { recipeName, note, ingredientsList } = req.body;

      if (
        !recipeName ||
        !Array.isArray(ingredientsList) ||
        ingredientsList.length === 0
      ) {
        return res
          .status(400)
          .json({ success: false, message: "Dữ liệu không hợp lệ" });
      }

      // Model Recipe.create nên xử lý Transaction để lưu cả 2 bảng
      const newRecipeId = await Recipe.create(
        recipeName,
        note,
        ingredientsList,
      );

      res
        .status(201)
        .json({
          success: true,
          message: "Tạo thành công",
          recipeId: newRecipeId,
        });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Lỗi khi tạo", error: error.message });
    }
  },

  // 4. Xóa toàn bộ công thức
  deleteRecipe: async (req, res) => {
    try {
      const { id } = req.params;
      const isDeleted = await Recipe.delete(id);
      if (!isDeleted)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy" });

      res
        .status(200)
        .json({ success: true, message: "Đã xóa công thức thành công" });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Lỗi khi xóa", error: error.message });
    }
  },

  // ==========================================
  // NHÓM 2: CHI TIẾT NGUYÊN LIỆU (RECIPE DETAILS)
  // ==========================================

  // 5. Cập nhật định lượng của 1 nguyên liệu trong công thức
  updateIngredientQuantity: async (req, res) => {
    try {
      const { recipeId, ingredientId } = req.params;
      const { newQuantity } = req.body;

      const isUpdated = await RecipeDetail.updateQuantity(
        recipeId,
        ingredientId,
        newQuantity,
      );
      if (!isUpdated)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy nguyên liệu" });

      res
        .status(200)
        .json({ success: true, message: "Cập nhật định lượng thành công" });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "Lỗi cập nhật",
          error: error.message,
        });
    }
  },

  // 6. Xóa 1 nguyên liệu cụ thể ra khỏi công thức
  removeIngredient: async (req, res) => {
    try {
      const { recipeId, ingredientId } = req.params;
      const isDeleted = await RecipeDetail.removeIngredient(
        recipeId,
        ingredientId,
      );

      if (!isDeleted)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy nguyên liệu" });
      res
        .status(200)
        .json({ success: true, message: "Đã loại bỏ nguyên liệu" });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "Lỗi xóa nguyên liệu",
          error: error.message,
        });
    }
  },
};

module.exports = RecipeController;
