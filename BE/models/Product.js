const pool = require("../config/database");

// Get all products
const getAllProducts = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT * FROM products WHERE deletedAt IS NULL ORDER BY createdAt DESC",
    );
    return rows;
  } finally {
    connection.release();
  }
};

// Get product by ID
const getProductById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT * FROM products WHERE id = ? AND deletedAt IS NULL",
      [id],
    );
    return rows[0];
  } finally {
    connection.release();
  }
};

// Create product
const createProduct = async (name, price, category, description, image) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "INSERT INTO products (name, price, category, description, image) VALUES (?, ?, ?, ?, ?)",
      [name, price, category, description, image],
    );
    return result.insertId;
  } finally {
    connection.release();
  }
};

// Update product
const updateProduct = async (id, name, price, category, description, image) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "UPDATE products SET name = ?, price = ?, category = ?, description = ?, image = ? WHERE id = ?",
      [name, price, category, description, image, id],
    );
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
};

// Soft delete product
const deleteProduct = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "UPDATE products SET deletedAt = NOW() WHERE id = ?",
      [id],
    );
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
};

// Get products by category
const getProductsByCategory = async (category) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT * FROM products WHERE category = ? AND deletedAt IS NULL ORDER BY createdAt DESC",
      [category],
    );
    return rows;
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
};
