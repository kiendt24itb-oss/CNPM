const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Hash password
const hashPassword = async (password) => {
  const salt = await bcryptjs.genSalt(10);
  return await bcryptjs.hash(password, salt);
};

// Compare password
const comparePassword = async (password, hashedPassword) => {
  return await bcryptjs.compare(password, hashedPassword);
};

// Generate JWT Token
const generateToken = (userId, userRole) => {
  return jwt.sign({ id: userId, role: userRole }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Response handler
const sendResponse = (res, statusCode, data, message = "") => {
  res.status(statusCode).json({
    success: statusCode < 400,
    message,
    data,
  });
};

module.exports = {
  hashPassword,
  comparePassword,
  generateToken,
  sendResponse,
};
