<?php
require_once __DIR__ . "/../controllers/order.php";

// ================= HEADER =================
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// ================= HANDLE CORS =================
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ================= INIT =================
$controller = new OrderController();
$method = $_SERVER["REQUEST_METHOD"];

// ================= PARAMS =================
$action = $_GET['action'] ?? null;
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

// ================= RESPONSE HELPER =================
function response($data, $code = 200) {
    http_response_code($code);
    echo json_encode($data);
    exit();
}

// ================= ROUTER =================
try {
    switch ($method) {

        // ================= GET =================
        case 'GET':

            // 👉 load data cho Add Order (bàn + menu)
            if ($action === 'create') {
                $result = $controller->create();
                response($result, $result['success'] ? 200 : 400);
            }

            // 👉 xem chi tiết 1 order
            elseif ($id) {
                $result = $controller->show($id);
                response($result, $result['success'] ? 200 : 400);
            }

            // 👉 danh sách order
            else {
                $result = $controller->index();
                response($result, $result['success'] ? 200 : 400);
            }

            break;

        // ================= POST =================
        case 'POST':

            $data = json_decode(file_get_contents("php://input"), true);

            // fallback FormData
            if (!$data) {
                $data = $_POST;
            }

            if (empty($data)) {
                response([
                    "success" => false,
                    "message" => "Dữ liệu không hợp lệ"
                ], 400);
            }

            // 👉 thanh toán
            if ($action === 'pay') {
                if (!$id) {
                    response([
                        "success" => false,
                        "message" => "Thiếu ID order"
                    ], 400);
                }

                $result = $controller->pay($id);
            }

            // 👉 tạo order
            else {
                $result = $controller->store($data);
            }

            response($result, $result['success'] ? 200 : 400);
            break;

            case 'PUT':
    if (!$id) {
        response(["success" => false, "message" => "Thiếu ID"], 400);
    }

    $data = json_decode(file_get_contents("php://input"), true);

    if (!$data) {
        parse_str(file_get_contents("php://input"), $data);
    }

    $result = $controller->update($id, $data);

    response($result, $result['success'] ? 200 : 400);
    break;

        // ================= DELETE =================
        case 'DELETE':

            if (!$id) {
                response([
                    "success" => false,
                    "message" => "Thiếu ID order"
                ], 400);
            }

            $result = $controller->delete($id);

            response($result, $result['success'] ? 200 : 400);
            break;

        // ================= DEFAULT =================
        default:
            response([
                "success" => false,
                "message" => "Phương thức không hỗ trợ"
            ], 405);
    }

} catch (Exception $e) {
    response([
        "success" => false,
        "message" => "Lỗi server",
        "error" => $e->getMessage()
    ], 500);
}