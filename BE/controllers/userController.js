const User = require("../models/User");
const { sendResponse } = require("../utils/helpers");

// Get all users (Admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    sendResponse(res, 200, users, "Lấy danh sách người dùng thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Get user profile
const getUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const user = await User.getUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    sendResponse(res, 200, user, "Lấy thông tin người dùng thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Get user by ID (Admin only)
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.getUserById(id);

    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    sendResponse(res, 200, user, "Lấy thông tin người dùng thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const { fullName } = req.body;

    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    await User.updateUser(userId, fullName, user.role);

    sendResponse(
      res,
      200,
      { userId },
      "Cập nhật thông tin người dùng thành công",
    );
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Update user (Admin only)
const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, role } = req.body;

    const user = await User.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    await User.updateUser(id, fullName, role);

    sendResponse(res, 200, { id }, "Cập nhật người dùng thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Delete user (Admin only)
const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }

    await User.deleteUser(id);

    sendResponse(res, 200, { id }, "Xóa người dùng thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  getAllUsers,
  getUserProfile,
  getUserById,
  updateUserProfile,
  updateUser,
  deleteUser,
};
