<?php
require_once __DIR__ . "/../models/Order.php";
require_once __DIR__ . "/../middleware/authMiddleware.php";

class OrderController {
    private $orderModel;
    private $auth;

    public function __construct() {
        $this->orderModel = new OrderModel();
        $this->auth = new AuthMiddleware();

        // Nhân viên đăng nhập mới được thao tác
        $this->auth->checkLogin();
    }

    // =========================================
    // 1. LOAD DATA CHO ADD ORDER (🔥 QUAN TRỌNG)
    // =========================================
    public function create() {
        try {
            return [
                "success" => true,
                "tables" => $this->orderModel->getAvailableTables(), // bàn trống
                "menu" => $this->orderModel->getMenuItems() // menu + giá
            ];
        } catch (Exception $e) {
            return [
                "success" => false,
                "message" => "Không thể load dữ liệu: " . $e->getMessage()
            ];
        }
    }

    // =========================================
    // 2. TẠO ORDER
    // =========================================
    public function store($data) {
        // validate cơ bản
        if (empty($data['table_id']) || empty($data['items'])) {
            return [
                "success" => false,
                "message" => "Thiếu bàn hoặc danh sách món"
            ];
        }

        try {
            $result = $this->orderModel->createFullOrder(
                $data['table_id'],
                $data['customer_name'] ?? '',
                $data['customer_count'] ?? 1,
                $data['status'] ?? 'UNPAID',
                $data['items']
            );

            return $result;

        } catch (Exception $e) {
            return [
                "success" => false,
                "message" => "Lỗi tạo đơn: " . $e->getMessage()
            ];
        }
    }

    // =========================================
    // 3. LẤY DANH SÁCH ORDER (HIỂN THỊ GRID)
    // =========================================
    public function index() {
        try {
            $data = $this->orderModel->getOrders();

            return [
                "success" => true,
                "data" => $data,
                "total" => count($data)
            ];

        } catch (Exception $e) {
            return [
                "success" => false,
                "message" => "Không thể lấy danh sách đơn"
            ];
        }
    }

    // =========================================
    // 4. CHI TIẾT ORDER
    // =========================================
    public function show($id) {
        if (empty($id)) {
            return [
                "success" => false,
                "message" => "Thiếu ID đơn hàng"
            ];
        }

        try {
            $items = $this->orderModel->getOrderDetail($id);

            return [
                "success" => true,
                "items" => $items
            ];

        } catch (Exception $e) {
            return [
                "success" => false,
                "message" => "Không thể lấy chi tiết đơn"
            ];
        }
    }

    // =========================================
    // 5. THANH TOÁN
    // =========================================
    public function pay($id) {
        if (empty($id)) {
            return [
                "success" => false,
                "message" => "Thiếu ID đơn hàng"
            ];
        }

        try {
            $result = $this->orderModel->payOrder($id);

            return $result
                ? ["success" => true, "message" => "Thanh toán thành công"]
                : ["success" => false, "message" => "Thanh toán thất bại"];

        } catch (Exception $e) {
            return [
                "success" => false,
                "message" => "Lỗi thanh toán: " . $e->getMessage()
            ];
        }
    }

    // =========================================
    // 6. XÓA ORDER
    // =========================================
    public function delete($id) {
    if (empty($id)) {
        return [
            "success" => false,
            "message" => "Thiếu ID đơn"
        ];
    }

    try {
        $result = $this->orderModel->deleteOrder($id);

        return $result
            ? ["success" => true, "message" => "Đã xóa đơn"]
            : ["success" => false, "message" => "Xóa thất bại"];

    } catch (Exception $e) {
        return [
            "success" => false,
            "message" => "Lỗi xóa đơn: " . $e->getMessage()
        ];
    }
}

    public function update($id, $data) {
    if (empty($id)) {
        return ["success" => false, "message" => "Thiếu ID"];
    }

    if (!isset($data['status'])) {
        return ["success" => false, "message" => "Thiếu status"];
    }

    $result = $this->orderModel->updateStatus($id, $data['status']);

    return $result
        ? ["success" => true, "message" => "Cập nhật thành công"]
        : ["success" => false, "message" => "Lỗi update"];
}
}