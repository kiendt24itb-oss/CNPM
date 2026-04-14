<?php
require_once __DIR__ . "/../controllers/staff.php";

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
$controller = new StaffController();
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

            // 👉 Lấy profile cá nhân (theo email login)
            if ($action === 'profile') {
                $result = $controller->profile();
            }

            // 👉 Thống kê staff (ADMIN)
            elseif ($action === 'stats') {
                $result = $controller->stats();
            }

            // 👉 Lấy danh sách staff (ADMIN)
            else {
                $result = $controller->index();
            }

            response($result, $result['success'] ? 200 : 400);
            break;

        // ================= POST =================
        case 'POST':

            // ❌ Không cho tạo staff
            response([
                "success" => false,
                "message" => "Không hỗ trợ tạo nhân viên"
            ], 403);
            break;

        // ================= PUT =================
        case 'PUT':

            $data = json_decode(file_get_contents("php://input"), true);

            if (!$data) {
                parse_str(file_get_contents("php://input"), $data);
            }

            if (empty($data)) {
                response([
                    "success" => false,
                    "message" => "Dữ liệu không hợp lệ"
                ], 400);
            }

            // 👉 update profile cá nhân
            if ($action === 'profile') {
                $result = $controller->updateProfile($data);
            }

            // 👉 ADMIN update staff
            else {
                if (!$id) {
                    response([
                        "success" => false,
                        "message" => "Thiếu ID"
                    ], 400);
                }

                $result = $controller->update($id, $data);
            }

            response($result, $result['success'] ? 200 : 400);
            break;

        // ================= DELETE =================
        case 'DELETE':

            if (!$id) {
                response([
                    "success" => false,
                    "message" => "Thiếu ID"
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