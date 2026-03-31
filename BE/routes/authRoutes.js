const express = require("express");
const authController = require("../controllers/authController");
const { validateRegister, validateLogin } = require("../middleware/role");

const router = express.Router();

// POST /api/auth/register
router.post("/register", validateRegister, authController.register);

// POST /api/auth/login
router.post("/login", validateLogin, authController.login);

// POST /api/auth/google-login
router.post("/google-login", authController.googleLogin);

module.exports = router;
