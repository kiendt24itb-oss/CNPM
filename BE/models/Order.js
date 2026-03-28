const pool = require("../config/database");

// Get all orders
const getAllOrders = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT * FROM orders ORDER BY createdAt DESC",
    );
    return rows;
  } finally {
    connection.release();
  }
};

// Get order by ID
const getOrderById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query("SELECT * FROM orders WHERE id = ?", [
      id,
    ]);
    return rows[0];
  } finally {
    connection.release();
  }
};

// Get user orders
const getUserOrders = async (userId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT * FROM orders WHERE userId = ? ORDER BY createdAt DESC",
      [userId],
    );
    return rows;
  } finally {
    connection.release();
  }
};

// Create order
const createOrder = async (userId, totalPrice, status, items) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "INSERT INTO orders (userId, totalPrice, status, items) VALUES (?, ?, ?, ?)",
      [userId, totalPrice, status || "pending", JSON.stringify(items)],
    );
    return result.insertId;
  } finally {
    connection.release();
  }
};

// Update order status
const updateOrderStatus = async (id, status) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      [status, id],
    );
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
};

// Cancel order
const cancelOrder = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "UPDATE orders SET status = ? WHERE id = ?",
      ["cancelled", id],
    );
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  getUserOrders,
  createOrder,
  updateOrderStatus,
  cancelOrder,
};
