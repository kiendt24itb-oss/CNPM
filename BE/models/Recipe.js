const pool = require("../config/database");

const Recipe = {
  // Lấy chi tiết công thức gồm các nguyên liệu gì
  getDetail: async (recipeId) => {
    const [rows] = await pool.query(
      `
      SELECT rd.*, i.name as ingredient_name, i.unit 
      FROM recipe_details rd
      JOIN ingredients i ON rd.ingredient_id = i.ingredient_id
      WHERE rd.recipe_id = ?
    `,
      [recipeId],
    );
    return rows;
  },

  // Tạo công thức mới kèm danh sách nguyên liệu
  create: async (recipeName, note, ingredientsList) => {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Tạo header công thức
      const [recipeRes] = await conn.query(
        "INSERT INTO recipes (recipe_name, note) VALUES (?, ?)",
        [recipeName, note],
      );
      const recipeId = recipeRes.insertId;

      // 2. Thêm chi tiết từng nguyên liệu vào recipe_details
      for (let item of ingredientsList) {
        await conn.query(
          "INSERT INTO recipe_details (recipe_id, ingredient_id, quantity, unit) VALUES (?, ?, ?, ?)",
          [recipeId, item.ingredient_id, item.quantity, item.unit],
        );
      }

      await conn.commit();
      return recipeId;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  },
};

module.exports = Recipe;
