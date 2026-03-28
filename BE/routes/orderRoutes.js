const express = require("express");
const orderController = require("../controllers/orderController");
const { verifyToken, checkAdmin } = require("../middleware/auth");
const { validateOrder } = require("../middleware/validator");

const router = express.Router();

// GET /api/orders - Admin only
router.get("/", verifyToken, checkAdmin, orderController.getAllOrders);

// GET /api/orders/user/my-orders - Get user's orders
router.get("/user/my-orders", verifyToken, orderController.getUserOrders);

// GET /api/orders/:id
router.get("/:id", verifyToken, orderController.getOrderById);

// POST /api/orders
router.post("/", verifyToken, validateOrder, orderController.createOrder);

// PUT /api/orders/:id/status - Update order status (Admin only)
router.put(
  "/:id/status",
  verifyToken,
  checkAdmin,
  orderController.updateOrderStatus,
);

// PUT /api/orders/:id/cancel - Cancel order
router.put("/:id/cancel", verifyToken, orderController.cancelOrder);

module.exports = router;
