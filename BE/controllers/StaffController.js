const Staff = require("../models/Staff");

const StaffController = {
  // [GET] /api/staff
  getAllStaff: async (req, res) => {
    try {
      const staff = await Staff.getAll();
      res.status(200).json({ success: true, data: staff });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Lỗi server", error: error.message });
    }
  },

  // [POST] /api/staff
  createStaff: async (req, res) => {
    try {
      const { name, cccd, email, role } = req.body;

      // Validate cơ bản
      if (!name || !cccd || !email || !role) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Thiếu thông tin bắt buộc (Tên, CCCD, Email, Role)",
          });
      }

      const staffId = await Staff.create(req.body);
      res
        .status(201)
        .json({ success: true, message: "Thêm nhân viên thành công", staffId });
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        return res
          .status(400)
          .json({ success: false, message: "CCCD hoặc Email đã tồn tại" });
      }
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // [PUT] /api/staff/:id
  updateStaff: async (req, res) => {
    try {
      const { id } = req.params;
      const updated = await Staff.update(id, req.body);

      if (!updated) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy nhân viên" });
      }

      res
        .status(200)
        .json({ success: true, message: "Cập nhật thông tin thành công" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // [DELETE] /api/staff/:id
  deleteStaff: async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await Staff.delete(id);

      if (!deleted) {
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy nhân viên" });
      }

      res
        .status(200)
        .json({
          success: true,
          message: "Đã xóa nhân viên và tài khoản liên quan",
        });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

module.exports = StaffController;
