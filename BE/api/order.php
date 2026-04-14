<?php
require_once __DIR__ . "/../controllers/order.php";

// Thiết lập Header để làm việc với JSON
header("Content-Type: application/json; charset=utf-8");

$controller = new OrderController();
$method = $_SERVER["REQUEST_METHOD"];

// Lấy ID từ URL nếu có (ví dụ: api/order.php?id=123)
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($method) {
    case 'GET':
        if ($id) {
            // Xem chi tiết một đơn hàng cụ thể
            echo json_encode($controller->show($id));
        } elseif (isset($_GET['action']) && $_GET['action'] === 'init-data') {
            // Lấy ds bàn trống và món ăn để hiện trong modal AddOrder
            echo json_encode($controller->getCreateData());
        } else {
            // Lấy danh sách tất cả hóa đơn (cho trang Order.html)
            echo json_encode($controller->index());
        }
        break;

    case 'POST':
        /**
         * Khi thêm đơn hàng, JS sẽ gửi chuỗi JSON lên qua body.
         * Dùng json_decode để chuyển thành mảng PHP.
         */
        $json_data = file_get_contents("php://input");
        $data = json_decode($json_data, true);

        if (!$data) {
            echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ"]);
            break;
        }

        echo json_encode($controller->store($data));
        break;

    case 'PATCH':
    case 'PUT':
        /**
         * Thường dùng để cập nhật trạng thái Thanh toán (markAsPaid).
         * URL ví dụ: api/order.php?id=123&action=pay
         */
        if ($id && isset($_GET['action']) && $_GET['action'] === 'pay') {
            echo json_encode($controller->markAsPaid($id));
        } else {
            echo json_encode(["success" => false, "message" => "Thiếu ID hoặc hành động không hợp lệ"]);
        }
        break;

    case 'DELETE':
        // Xóa đơn hàng (Chỉ dành cho Admin)
        if ($id) {
            echo json_encode($controller->delete($id));
        } else {
            echo json_encode(["success" => false, "message" => "Thiếu ID đơn hàng"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Phương thức không hỗ trợ"]);
        break;
}