const express = require("express");
const userController = require("../controllers/UserController");
const { verifyToken, checkAdmin } = require("../middleware/auth");

const router = express.Router();

// GET /api/users - Admin only
router.get("/", verifyToken, checkAdmin, userController.getAllUsers);

// GET /api/users/profile - Get logged in user profile
router.get("/profile/me", verifyToken, userController.getUserProfile);

// GET /api/users/:id - Admin only
router.get("/:id", verifyToken, checkAdmin, userController.getUserById);

// PUT /api/users/profile - Update logged in user profile
router.put("/profile/update", verifyToken, userController.updateUserProfile);

// PUT /api/users/:id - Admin only
router.put("/:id", verifyToken, checkAdmin, userController.updateUser);

// DELETE /api/users/:id - Admin only
router.delete("/:id", verifyToken, checkAdmin, userController.deleteUser);

module.exports = router;
