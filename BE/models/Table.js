const pool = require("../config/database");

const Table = {
  getAll: async () => {
    const [rows] = await pool.query(
      "SELECT * FROM tables ORDER BY area, table_number",
    );
    return rows;
  },

  updateStatus: async (id, status) => {
    const [result] = await pool.query(
      "UPDATE tables SET status = ? WHERE table_id = ?",
      [status, id],
    );
    return result.affectedRows > 0;
  },

  getByArea: async (area) => {
    const [rows] = await pool.query("SELECT * FROM tables WHERE area = ?", [
      area,
    ]);
    return rows;
  },
};

module.exports = Table;
