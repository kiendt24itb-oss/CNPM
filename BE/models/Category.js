const pool = require("../config/database");

const Category = {
  getAll: async () => {
    const [rows] = await pool.query(
      "SELECT * FROM categories ORDER BY category_name ASC",
    );
    return rows;
  },

  create: async (name) => {
    const [result] = await pool.query(
      "INSERT INTO categories (category_name) VALUES (?)",
      [name],
    );
    return result.insertId;
  },

  delete: async (id) => {
    const [result] = await pool.query(
      "DELETE FROM categories WHERE category_id = ?",
      [id],
    );
    return result.affectedRows > 0;
  },
};

module.exports = Category;
