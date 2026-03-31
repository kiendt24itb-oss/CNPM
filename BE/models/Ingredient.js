const pool = require("../config/database");

const Ingredient = {
  getAll: async () => {
    const [rows] = await pool.query("SELECT * FROM ingredients");
    return rows;
  },

  // Cập nhật số lượng tồn kho (Nhập hàng hoặc Kiểm kho)
  updateStock: async (id, quantity) => {
    const [result] = await pool.query(
      "UPDATE ingredients SET stock_quantity = stock_quantity + ? WHERE ingredient_id = ?",
      [quantity, id],
    );
    return result.affectedRows > 0;
  },

  // Lấy danh sách nguyên liệu sắp hết (dưới mức min_stock)
  getLowStock: async () => {
    const [rows] = await pool.query(
      "SELECT * FROM ingredients WHERE stock_quantity <= min_stock",
    );
    return rows;
  },
};

module.exports = Ingredient;
