const User = require("../models/User");
const bcrypt = require("bcrypt"); // Nên dùng bcrypt để mã hóa mật khẩu

const UserController = {
  // 1. Tạo tài khoản người dùng
  register: async (req, res) => {
    try {
      const { username, email, password, role } = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập đầy đủ username, email và mật khẩu",
        });
      }

      // Mã hóa mật khẩu trước khi lưu
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const userId = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
      });

      res.status(201).json({
        success: true,
        message: "Tạo tài khoản thành công",
        userId,
      });
    } catch (error) {
      if (error.code === "ER_NO_REFERENCED_ROW_2") {
        return res.status(400).json({
          success: false,
          message:
            "Email này chưa có trong hồ sơ nhân viên (Staff). Hãy tạo Staff trước!",
        });
      }
      res.status(500).json({
        success: false,
        message: "Lỗi khi tạo tài khoản",
        error: error.message,
      });
    }
  },

  // 2. Lấy danh sách tất cả tài khoản
  getUsers: async (req, res) => {
    try {
      const users = await User.getAll();
      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi server",
        error: error.message,
      });
    }
  },
};

module.exports = UserController;
