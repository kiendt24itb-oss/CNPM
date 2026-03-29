const Order = require("../models/Order");
const { sendResponse } = require("../utils/helpers");

// Get all orders (Admin only)
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.getAllOrders();
    sendResponse(res, 200, orders, "Lấy danh sách đơn hàng thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Get order by ID
const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.getOrderById(id);

    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    sendResponse(res, 200, order, "Lấy đơn hàng thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Get user orders
const getUserOrders = async (req, res) => {
  try {
    const userId = req.userId;
    const orders = await Order.getUserOrders(userId);

    sendResponse(res, 200, orders, "Lấy đơn hàng của bạn thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Create order
const createOrder = async (req, res) => {
  try {
    const userId = req.userId;
    const { tableId, customerName, customerCount, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Items không được để trống" });
    }

    const orderId = await Order.createOrder(
      userId,
      tableId,
      customerName,
      customerCount,
      items,
    );

    sendResponse(res, 201, { id: orderId }, "Tạo đơn hàng thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Update order status (Admin only)
const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    await Order.updateOrderStatus(id, status);

    sendResponse(res, 200, { id }, "Cập nhật trạng thái đơn hàng thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: "Đơn hàng không tồn tại" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Không thể hủy đơn hàng này" });
    }

    await Order.cancelOrder(id);

    sendResponse(res, 200, { id }, "Hủy đơn hàng thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  getAllOrders,
  getOrderById,
  getUserOrders,
  createOrder,
  updateOrderStatus,
  cancelOrder,
};
