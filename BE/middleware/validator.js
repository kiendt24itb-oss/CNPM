const { body, validationResult } = require("express-validator");

// Middleware để check validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Validation rules
const validateRegister = [
  body("email").isEmail().normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password phải ít nhất 6 ký tự"),
  body("fullName").notEmpty().withMessage("Tên không được để trống"),
  handleValidationErrors,
];

const validateLogin = [
  body("email").isEmail().normalizeEmail(),
  body("password").notEmpty(),
  handleValidationErrors,
];

const validateProduct = [
  body("name").notEmpty().withMessage("Tên sản phẩm không được để trống"),
  body("price").isFloat({ min: 0 }).withMessage("Giá phải là số dương"),
  body("description").optional(),
  handleValidationErrors,
];

const validateOrder = [
  body("items").isArray().withMessage("Items phải là mảng"),
  body("totalPrice")
    .isFloat({ min: 0 })
    .withMessage("Tổng giá phải là số dương"),
  handleValidationErrors,
];

module.exports = {
  validateRegister,
  validateLogin,
  validateProduct,
  validateOrder,
  handleValidationErrors,
};
