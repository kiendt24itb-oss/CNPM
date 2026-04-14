<?php
require_once __DIR__ . "/../models/order.php";
require_once __DIR__ . "/../middleware/authMiddleware.php";

class OrderController {
    private $orderModel;
    private $auth;

    public function __construct() {
        $this->orderModel = new Order();
        $this->auth = new AuthMiddleware();
        
        // Cần đăng nhập mới có thể thao tác với đơn hàng
        $this->auth->checkLogin();
    }

    /**
     * 1. Lấy dữ liệu để đổ vào Modal "Thêm đơn hàng"
     * Bao gồm: Bàn trống và Danh sách thực đơn
     */
    public function getCreateData() {
        try {
            $data = $this->orderModel->getInitializeData();
            return [
                "success" => true,
                "tables" => $data['tables'],
                "menu" => $data['menu']
            ];
        } catch (Exception $e) {
            return ["success" => false, "message" => "Không thể lấy dữ liệu khởi tạo"];
        }
    }

    /**
     * 2. Lưu đơn hàng mới
     * Xử lý dữ liệu từ form gửi lên (JS fetch)
     */
    public function store($data) {
        // Kiểm tra dữ liệu đầu vào cơ bản
        if (empty($data['table_id']) && empty($data['customer_name'])) {
            return ["success" => false, "message" => "Vui lòng chọn bàn hoặc nhập tên khách hàng"];
        }

        if (empty($data['items']) || count($data['items']) == 0) {
            return ["success" => false, "message" => "Đơn hàng phải có ít nhất một món"];
        }

        // Gọi Model xử lý lưu DB (đã có Transaction bên trong Model)
        $result = $this->orderModel->saveOrder(
            $data['table_id'] ?? null,
            $data['customer_name'],
            $data['customer_count'] ?? 1,
            $data['items'],
            $data['is_paid'] ?? false // Nút "Xác nhận" (false) hoặc "Thanh toán" (true)
        );

        if ($result['success']) {
            return [
                "success" => true, 
                "message" => "Tạo đơn hàng thành công", 
                "order_id" => $result['order_id']
            ];
        } else {
            return ["success" => false, "message" => "Lỗi: " . $result['message']];
        }
    }

    /**
     * 3. Lấy danh sách tất cả đơn hàng (Hiển thị tại màn hình chính Order)
     */
    public function index() {
        $orders = $this->orderModel->getAllOrders();
        return [
            "success" => true,
            "data" => $orders,
            "total" => count($orders)
        ];
    }

    /**
     * 4. Xem chi tiết một đơn hàng
     */
    public function show($id) {
        $details = $this->orderModel->getOrderDetails($id);
        if ($details) {
            return ["success" => true, "data" => $details];
        }
        return ["success" => false, "message" => "Không tìm thấy chi tiết đơn hàng"];
    }

    /**
     * 5. Cập nhật trạng thái Thanh toán (Chỉ dành cho đơn đang UNPAID)
     */
    public function markAsPaid($id) {
        $result = $this->orderModel->markAsPaid($id);
        return $result 
            ? ["success" => true, "message" => "Thanh toán thành công, bàn đã được giải phóng"]
            : ["success" => false, "message" => "Lỗi khi cập nhật trạng thái thanh toán"];
    }

    /**
     * 6. Xóa đơn hàng (Chỉ Admin mới có quyền xóa để tránh gian lận)
     */
    public function destroy($id) {
        $this->auth->checkAdmin();
        
        $result = $this->orderModel->deleteOrder($id);
        return $result 
            ? ["success" => true, "message" => "Đã xóa đơn hàng"]
            : ["success" => false, "message" => "Không thể xóa đơn hàng này"];
    }
}