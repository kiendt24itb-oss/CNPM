const pool = require("../config/database");

const RecipeDetail = {
  // Lấy toàn bộ nguyên liệu cần thiết cho một công thức
  getByRecipeId: async (recipeId) => {
    const [rows] = await pool.query(
      `
      SELECT rd.*, i.name as ingredient_name, i.unit as ingredient_unit
      FROM recipe_details rd
      JOIN ingredients i ON rd.ingredient_id = i.ingredient_id
      WHERE rd.recipe_id = ?
    `,
      [recipeId],
    );
    return rows;
  },

  // Cập nhật định mức cho một nguyên liệu trong công thức
  updateQuantity: async (recipeId, ingredientId, newQuantity) => {
    const [result] = await pool.query(
      "UPDATE recipe_details SET quantity = ? WHERE recipe_id = ? AND ingredient_id = ?",
      [newQuantity, recipeId, ingredientId],
    );
    return result.affectedRows > 0;
  },

  // Xóa một nguyên liệu khỏi công thức
  removeIngredient: async (recipeId, ingredientId) => {
    const [result] = await pool.query(
      "DELETE FROM recipe_details WHERE recipe_id = ? AND ingredient_id = ?",
      [recipeId, ingredientId],
    );
    return result.affectedRows > 0;
  },
};

module.exports = RecipeDetail;
