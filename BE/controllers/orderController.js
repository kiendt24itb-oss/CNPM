const Order = require("../models/Order");
const OrderItem = require("../models/OrderItem");

const OrderController = {
  // ==========================================
  // NHÓM 1: QUẢN LÝ HÓA ĐƠN CHÍNH (ORDERS)
  // ==========================================

  // 1. Lấy danh sách tất cả hóa đơn (Dành cho Admin xem báo cáo)
  getAll: async (req, res) => {
    try {
      const orders = await Order.getAllOrders();
      res.status(200).json({ success: true, data: orders });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Lỗi server", error: error.message });
    }
  },

  // 2. Chi tiết một hóa đơn (Kèm mảng items bên trong)
  getById: async (req, res) => {
    try {
      const order = await Order.getOrderById(req.params.id);
      if (!order)
        return res
          .status(404)
          .json({ success: false, message: "Không tìm thấy" });
      res.status(200).json({ success: true, data: order });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Lỗi server", error: error.message });
    }
  },

  // 3. Tạo hóa đơn mới (Đặt món lần đầu)
  create: async (req, res) => {
    try {
      const { userId, tableId, customerName, customerCount, items } = req.body;
      if (!items || items.length === 0) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Đơn hàng phải có ít nhất một món",
          });
      }
      // Model Order.createOrder nên xử lý Transaction: Lưu Order -> Lưu Items -> Đổi trạng thái bàn
      const orderId = await Order.createOrder(
        userId,
        tableId,
        customerName,
        customerCount,
        items,
      );
      res
        .status(201)
        .json({ success: true, message: "Tạo đơn hàng thành công", orderId });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Lỗi tạo đơn", error: error.message });
    }
  },

  // 4. Thanh toán hoặc Cập nhật trạng thái
  updateStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body; // status: 'PAID', 'CANCELLED'
      const updated = await Order.updateOrderStatus(id, status);
      if (!updated)
        return res
          .status(404)
          .json({ success: false, message: "Cập nhật thất bại" });
      res.status(200).json({ success: true, message: `Trạng thái: ${status}` });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Lỗi server", error: error.message });
    }
  },

  // ==========================================
  // NHÓM 2: CHI TIẾT MÓN TRONG ĐƠN (ORDER ITEMS)
  // ==========================================

  // 5. Thêm món vào đơn hàng đã tồn tại (Khách gọi thêm món)
  addItems: async (req, res) => {
    try {
      const { id } = req.params; // order_id
      const { items } = req.body;
      if (!items || items.length === 0)
        return res.status(400).json({ message: "Danh sách món trống" });

      const rowsAffected = await OrderItem.addItems(id, items);
      res
        .status(201)
        .json({ success: true, message: `Đã thêm ${rowsAffected} món mới` });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },

  // 6. Xóa/Hủy đơn hàng nhanh (Giải phóng bàn)
  cancel: async (req, res) => {
    try {
      const cancelled = await Order.cancelOrder(req.params.id);
      if (!cancelled) return res.status(404).json({ message: "Không thể hủy" });
      res
        .status(200)
        .json({ success: true, message: "Đã hủy đơn và giải phóng bàn" });
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  },
};

module.exports = OrderController;
