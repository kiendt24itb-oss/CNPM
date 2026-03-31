const pool = require("../config/database");

const OrderItem = {
  // Lấy danh sách món của 1 hóa đơn kèm tên món từ bảng Menu
  getByOrderId: async (orderId) => {
    const [rows] = await pool.query(
      `
      SELECT oi.*, m.name as product_name 
      FROM order_items oi
      JOIN menu m ON oi.menu_id = m.menu_id
      WHERE oi.order_id = ?
    `,
      [orderId],
    );
    return rows;
  },

  // Thêm món vào đơn hàng (Dùng trong vòng lặp của Order.create)
  addItems: async (orderId, items) => {
    const values = items.map((item) => [orderId, item.menu_id, item.quantity]);
    const [result] = await pool.query(
      "INSERT INTO order_items (order_id, menu_id, quantity) VALUES ?",
      [values],
    );
    return result.affectedRows;
  },
};

module.exports = OrderItem;
