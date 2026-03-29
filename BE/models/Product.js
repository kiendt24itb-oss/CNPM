const pool = require("../config/database");

// Get all products
const getAllProducts = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT p.product_id, p.product_name, p.price, p.image_url, p.description,
             p.category_id, p.status, c.category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      ORDER BY p.product_id
    `);
    return rows.map((row) => ({
      id: row.product_id,
      name: row.product_name,
      price: row.price,
      imageUrl: row.image_url,
      description: row.description,
      categoryId: row.category_id,
      categoryName: row.category_name,
      status: row.status,
    }));
  } finally {
    connection.release();
  }
};

// Get product by ID
const getProductById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `
      SELECT p.product_id, p.product_name, p.price, p.image_url, p.description,
             p.category_id, p.status, c.category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.product_id = ?
    `,
      [id],
    );
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      id: row.product_id,
      name: row.product_name,
      price: row.price,
      imageUrl: row.image_url,
      description: row.description,
      categoryId: row.category_id,
      categoryName: row.category_name,
      status: row.status,
    };
  } finally {
    connection.release();
  }
};

// Create product
const createProduct = async (
  name,
  price,
  categoryId,
  description,
  imageUrl,
) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "INSERT INTO products (product_name, price, category_id, description, image_url) VALUES (?, ?, ?, ?, ?)",
      [name, price, categoryId, description, imageUrl],
    );
    return result.insertId;
  } finally {
    connection.release();
  }
};

// Update product
const updateProduct = async (
  id,
  name,
  price,
  categoryId,
  description,
  imageUrl,
  status,
) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "UPDATE products SET product_name = ?, price = ?, category_id = ?, description = ?, image_url = ?, status = ? WHERE product_id = ?",
      [name, price, categoryId, description, imageUrl, status, id],
    );
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
};

// Delete product
const deleteProduct = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "DELETE FROM products WHERE product_id = ?",
      [id],
    );
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
};

// Get products by category
const getProductsByCategory = async (categoryId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `
      SELECT p.product_id, p.product_name, p.price, p.image_url, p.description,
             p.category_id, p.status, c.category_name
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.category_id = ? AND p.status = 'AVAILABLE'
      ORDER BY p.product_name
    `,
      [categoryId],
    );
    return rows.map((row) => ({
      id: row.product_id,
      name: row.product_name,
      price: row.price,
      imageUrl: row.image_url,
      description: row.description,
      categoryId: row.category_id,
      categoryName: row.category_name,
      status: row.status,
    }));
  } finally {
    connection.release();
  }
};

// Get all categories
const getAllCategories = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT * FROM categories ORDER BY category_name",
    );
    return rows.map((row) => ({
      id: row.category_id,
      name: row.category_name,
    }));
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
  getAllCategories,
};
