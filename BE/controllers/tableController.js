const Table = require("../models/Table");

const TableController = {
  // 1. Lấy danh sách tất cả các bàn (Có tính toán tổng số bàn và bàn đang dùng)
  getAllTables: async (req, res) => {
    try {
      const tables = await Table.getAll();

      // Tính toán thống kê nhanh cho giao diện
      const totalTables = tables.length;
      const occupiedTables = tables.filter(
        (t) => t.status === "Đang dùng",
      ).length;

      res.status(200).json({
        success: true,
        summary: {
          total: totalTables,
          occupied: occupiedTables,
        },
        data: tables,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy danh sách bàn",
        error: error.message,
      });
    }
    Boat;
  },

  // 2. Thêm bàn mới (Chỉ ADMIN)
  createTable: async (req, res) => {
    try {
      const { table_number, area, capacity, note } = req.body;

      // Validation cơ bản
      if (!table_number || !area) {
        return res
          .status(400)
          .json({ success: false, message: "Số bàn và khu vực là bắt buộc" });
      }

      const newTableData = {
        table_number,
        area,
        capacity: capacity || 4,
        note: note || "",
        status: "Trống", // Mặc định khi tạo là bàn trống
      };

      const result = await Table.create(newTableData);
      res.status(201).json({
        success: true,
        message: "Thêm bàn mới thành công",
        data: result,
      });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "Lỗi khi tạo bàn",
          error: error.message,
        });
    }
  },

  // 3. Cập nhật thông tin bàn (Dùng cho nút "Sửa" - Chỉ ADMIN)
  updateTable: async (req, res) => {
    try {
      const { id } = req.params;
      const { table_number, area, capacity, note, status } = req.body;

      const isUpdated = await Table.update(id, {
        table_number,
        area,
        capacity,
        note,
        status,
      });

      if (!isUpdated) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy bàn để cập nhật" });
      }

      res
        .status(200)
        .json({ success: true, message: "Cập nhật thông tin bàn thành công" });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "Lỗi khi cập nhật bàn",
          error: error.message,
        });
    }
  },

  // 4. Xóa bàn (Chỉ ADMIN)
  deleteTable: async (req, res) => {
    try {
      const { id } = req.params;
      const isDeleted = await Table.delete(id);

      if (!isDeleted) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy bàn để xóa" });
      }

      res.status(200).json({ success: true, message: "Đã xóa bàn thành công" });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "Lỗi khi xóa bàn",
          error: error.message,
        });
    }
  },

  // 5. Tìm kiếm theo khu vực hoặc số bàn
  searchTables: async (req, res) => {
    try {
      const { query } = req.query; // Ví dụ: ?query=06 hoặc ?query=Ban công
      const tables = await Table.search(query);

      res.status(200).json({
        success: true,
        data: tables,
      });
    } catch (error) {
      res
        .status(500)
        .json({
          success: false,
          message: "Lỗi tìm kiếm",
          error: error.message,
        });
    }
  },
};

module.exports = TableController;
