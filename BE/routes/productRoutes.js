const express = require("express");
const productController = require("../controllers/productController");
const { verifyToken, checkAdmin } = require("../middleware/auth");
const { validateProduct } = require("../middleware/validator");

const router = express.Router();

// GET /api/products
router.get("/", productController.getAllProducts);

// GET /api/products/:id
router.get("/:id", productController.getProductById);

// GET /api/products/category/:category
router.get("/category/:category", productController.getProductsByCategory);

// POST /api/products
router.post(
  "/",
  verifyToken,
  checkAdmin,
  validateProduct,
  productController.createProduct,
);

// PUT /api/products/:id
router.put(
  "/:id",
  verifyToken,
  checkAdmin,
  validateProduct,
  productController.updateProduct,
);

// DELETE /api/products/:id
router.delete("/:id", verifyToken, checkAdmin, productController.deleteProduct);

module.exports = router;
