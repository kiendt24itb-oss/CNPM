const pool = require("../config/database");

const Staff = {
  // Lấy toàn bộ danh sách nhân viên
  getAll: async () => {
    const [rows] = await pool.query(
      "SELECT * FROM staff ORDER BY hire_date DESC",
    );
    return rows;
  },

  // Lấy chi tiết 1 nhân viên theo ID
  getById: async (id) => {
    const [rows] = await pool.query("SELECT * FROM staff WHERE staff_id = ?", [
      id,
    ]);
    return rows[0];
  },

  // Tạo nhân viên mới (Bao gồm Email để liên kết User)
  create: async (data) => {
    const { name, cccd, email, birth_date, role } = data;
    const [result] = await pool.query(
      "INSERT INTO staff (name, cccd, email, birth_date, role) VALUES (?, ?, ?, ?, ?)",
      [name, cccd, email, birth_date, role],
    );
    return result.insertId;
  },

  // Cập nhật thông tin nhân viên
  update: async (id, data) => {
    const { name, cccd, email, birth_date, role } = data;
    const [result] = await pool.query(
      "UPDATE staff SET name = ?, cccd = ?, email = ?, birth_date = ?, role = ? WHERE staff_id = ?",
      [name, cccd, email, birth_date, role, id],
    );
    return result.affectedRows > 0;
  },

  // Xóa nhân viên (Sẽ tự động xóa User liên quan do ON DELETE CASCADE trong SQL)
  delete: async (id) => {
    const [result] = await pool.query("DELETE FROM staff WHERE staff_id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  },
};

module.exports = Staff;
