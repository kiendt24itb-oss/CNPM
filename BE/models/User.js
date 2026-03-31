const pool = require("../config/database");

const User = {
  // Tìm user để Login (Lấy luôn tên từ bảng staff)
  findByCredentials: async (identifier) => {
    const [rows] = await pool.query(
      `SELECT u.*, s.name as staff_name 
       FROM users u
       LEFT JOIN staff s ON u.email = s.email
       WHERE u.email = ? OR u.username = ?`,
      [identifier, identifier],
    );
    return rows[0];
  },

  // Tạo tài khoản (Lưu ý: Email phải tồn tại bên bảng Staff trước)
  create: async (userData) => {
    const { username, email, password, role } = userData;
    const [result] = await pool.query(
      "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
      [username, email, password, role || "STAFF"],
    );
    return result.insertId;
  },

  // Lấy danh sách kèm thông tin nhân viên
  getAll: async () => {
    const [rows] = await pool.query(
      `SELECT u.user_id, u.username, s.name as full_name, u.email, u.role, u.created_at 
       FROM users u
       JOIN staff s ON u.email = s.email`,
    );
    return rows;
  },
};

module.exports = User;
