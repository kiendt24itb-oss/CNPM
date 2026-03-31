const pool = require("../config/database");

const Product = {
  getAll: async () => {
    const [rows] = await pool.query(`
      SELECT m.*, c.category_name 
      FROM menu m 
      LEFT JOIN categories c ON m.category_id = c.category_id
    `);
    return rows;
  },

  getById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM menu WHERE menu_id = ?", [
      id,
    ]);
    return rows[0];
  },

  create: async (data) => {
    const { name, price, description, image, category_id, recipe_id } = data;
    const [result] = await pool.query(
      "INSERT INTO menu (name, price, description, image, category_id, recipe_id) VALUES (?, ?, ?, ?, ?, ?)",
      [name, price, description, image, category_id, recipe_id],
    );
    return result.insertId;
  },
};

module.exports = Product;
