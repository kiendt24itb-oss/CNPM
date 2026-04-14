<?php
require_once __DIR__ . "/../controllers/table.php";

// ================= HEADER =================
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// ================= HANDLE CORS PREFLIGHT =================
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ================= INIT =================
$controller = new TableController();
$method = $_SERVER["REQUEST_METHOD"];

// ================= GET PARAMS =================
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$status = $_GET['status'] ?? null;
$search = $_GET['search'] ?? null;

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
            $params = [];

            if (!empty($status) && $status !== 'Tất cả') {
                $params['status'] = $status;
            }

            if (!empty($search)) {
                $params['search'] = $search;
            }

            $result = $controller->index($params);

            response($result, $result['success'] ? 200 : 400);
            break;

        // ================= POST =================
        case 'POST':
            // Ưu tiên JSON
            $data = json_decode(file_get_contents("php://input"), true);

            // fallback FormData
            if (!$data) {
                $data = $_POST;
            }

            if (empty($data)) {
                response([
                    "success" => false,
                    "message" => "Dữ liệu gửi lên không hợp lệ"
                ], 400);
            }

            $result = $controller->store($data);

            response($result, $result['success'] ? 200 : 400);
            break;

        // ================= PUT =================
        case 'PUT':
            if (!$id) {
                response([
                    "success" => false,
                    "message" => "Thiếu ID bàn cần cập nhật"
                ], 400);
            }

            $data = json_decode(file_get_contents("php://input"), true);

            // fallback nếu gửi dạng x-www-form-urlencoded
            if (!$data) {
                parse_str(file_get_contents("php://input"), $data);
            }

            if (empty($data)) {
                response([
                    "success" => false,
                    "message" => "Dữ liệu cập nhật không hợp lệ"
                ], 400);
            }

            $result = $controller->update($id, $data);

            response($result, $result['success'] ? 200 : 400);
            break;

        // ================= DELETE =================
        case 'DELETE':
            if (!$id) {
                response([
                    "success" => false,
                    "message" => "Thiếu ID bàn cần xóa"
                ], 400);
            }

            $result = $controller->delete($id);

            response($result, $result['success'] ? 200 : 400);
            break;

        // ================= DEFAULT =================
        default:
            response([
                "success" => false,
                "message" => "Phương thức không được hỗ trợ"
            ], 405);
    }

} catch (Exception $e) {
    response([
        "success" => false,
        "message" => "Lỗi server",
        "error" => $e->getMessage()
    ], 500);
}