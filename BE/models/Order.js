const pool = require("../config/database");

// Get all orders
const getAllOrders = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT o.order_id, o.order_code, o.table_id, o.user_id, o.customer_name,
             o.customer_count, o.total_amount, o.order_time, o.status,
             t.table_name, u.username
      FROM orders o
      LEFT JOIN cafe_tables t ON o.table_id = t.table_id
      LEFT JOIN users u ON o.user_id = u.user_id
      ORDER BY o.order_time DESC
    `);
    return rows.map((row) => ({
      id: row.order_id,
      code: row.order_code,
      tableId: row.table_id,
      tableName: row.table_name,
      userId: row.user_id,
      userName: row.username,
      customerName: row.customer_name,
      customerCount: row.customer_count,
      totalAmount: row.total_amount,
      orderTime: row.order_time,
      status: row.status,
    }));
  } finally {
    connection.release();
  }
};

// Get order by ID with items
const getOrderById = async (id) => {
  const connection = await pool.getConnection();
  try {
    // Get order info
    const [orderRows] = await connection.query(
      `
      SELECT o.order_id, o.order_code, o.table_id, o.user_id, o.customer_name,
             o.customer_count, o.total_amount, o.order_time, o.status,
             t.table_name, u.username
      FROM orders o
      LEFT JOIN cafe_tables t ON o.table_id = t.table_id
      LEFT JOIN users u ON o.user_id = u.user_id
      WHERE o.order_id = ?
    `,
      [id],
    );

    if (orderRows.length === 0) return null;

    const order = orderRows[0];

    // Get order items
    const [itemRows] = await connection.query(
      `
      SELECT oi.order_item_id, oi.product_id, oi.quantity, oi.price, oi.note,
             p.product_name
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = ?
    `,
      [id],
    );

    return {
      id: order.order_id,
      code: order.order_code,
      tableId: order.table_id,
      tableName: order.table_name,
      userId: order.user_id,
      userName: order.username,
      customerName: order.customer_name,
      customerCount: order.customer_count,
      totalAmount: order.total_amount,
      orderTime: order.order_time,
      status: order.status,
      items: itemRows.map((item) => ({
        id: item.order_item_id,
        productId: item.product_id,
        productName: item.product_name,
        quantity: item.quantity,
        price: item.price,
        note: item.note,
      })),
    };
  } finally {
    connection.release();
  }
};

// Get user orders
const getUserOrders = async (userId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      `
      SELECT o.order_id, o.order_code, o.table_id, o.customer_name,
             o.total_amount, o.order_time, o.status, t.table_name
      FROM orders o
      LEFT JOIN cafe_tables t ON o.table_id = t.table_id
      WHERE o.user_id = ?
      ORDER BY o.order_time DESC
    `,
      [userId],
    );
    return rows.map((row) => ({
      id: row.order_id,
      code: row.order_code,
      tableId: row.table_id,
      tableName: row.table_name,
      customerName: row.customer_name,
      totalAmount: row.total_amount,
      orderTime: row.order_time,
      status: row.status,
    }));
  } finally {
    connection.release();
  }
};

// Create order with items
const createOrder = async (
  userId,
  tableId,
  customerName,
  customerCount,
  items,
) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Generate order code
    const orderCode = `ORD${Date.now()}`;

    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.price * item.quantity;
    }

    // Insert order
    const [orderResult] = await connection.query(
      `INSERT INTO orders (order_code, table_id, user_id, customer_name,
                          customer_count, total_amount, status)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        orderCode,
        tableId,
        userId,
        customerName,
        customerCount,
        totalAmount,
        "OPEN",
      ],
    );

    const orderId = orderResult.insertId;

    // Insert order items
    for (const item of items) {
      await connection.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price, note)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.productId, item.quantity, item.price, item.note || ""],
      );
    }

    // Update table status to OCCUPIED
    if (tableId) {
      await connection.query(
        "UPDATE cafe_tables SET status = 'OCCUPIED' WHERE table_id = ?",
        [tableId],
      );
    }

    await connection.commit();
    return orderId;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Update order status
const updateOrderStatus = async (id, status) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const [result] = await connection.query(
      "UPDATE orders SET status = ? WHERE order_id = ?",
      [status, id],
    );

    // If order is paid or cancelled, free the table
    if (status === "PAID" || status === "CANCELLED") {
      const [orderRows] = await connection.query(
        "SELECT table_id FROM orders WHERE order_id = ?",
        [id],
      );
      if (orderRows.length > 0 && orderRows[0].table_id) {
        await connection.query(
          "UPDATE cafe_tables SET status = 'EMPTY' WHERE table_id = ?",
          [orderRows[0].table_id],
        );
      }
    }

    await connection.commit();
    return result.affectedRows > 0;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

// Cancel order
const cancelOrder = async (id) => {
  return updateOrderStatus(id, "CANCELLED");
};

module.exports = {
  getAllOrders,
  getOrderById,
  getUserOrders,
  createOrder,
  updateOrderStatus,
  cancelOrder,
};
