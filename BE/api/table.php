<?php
require_once __DIR__ . "/../controllers/TableController.php";

// Thiết lập Header để trả về định dạng JSON
header("Content-Type: application/json; charset=utf-8");
header("Access-Control-Allow-Origin: *"); // Cho phép gọi API từ các domain khác nếu cần
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");

$controller = new TableController();
$method = $_SERVER["REQUEST_METHOD"];

// Lấy các tham số từ URL
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$status = isset($_GET['status']) ? $_GET['status'] : null;
$search = isset($_GET['search']) ? $_GET['search'] : null;

switch ($method) {
    case 'GET':
        /**
         * Lấy danh sách bàn. 
         * Có thể kèm theo filter ?status=Trống hoặc ?search=101
         */
        echo json_encode($controller->index([
            'status' => $status,
            'search' => $search
        ]));
        break;

    case 'POST':
        /**
         * Thêm bàn mới.
         * Dữ liệu nhận từ FormData hoặc JSON body.
         */
        // Nếu gửi bằng JSON body
        $data = json_decode(file_get_contents("php://input"), true);
        
        // Nếu gửi bằng Form thông thường ($_POST)
        if (!$data) {
            $data = $_POST;
        }

        echo json_encode($controller->store($data));
        break;

    case 'PUT':
        /**
         * Cập nhật thông tin bàn hoặc trạng thái dọn dẹp.
         * URL yêu cầu dạng: api/tables.php?id=5
         */
        if ($id) {
            $data = json_decode(file_get_contents("php://input"), true);
            echo json_encode($controller->update($id, $data));
        } else {
            echo json_encode(["success" => false, "message" => "Thiếu ID bàn cần cập nhật"]);
        }
        break;

    case 'DELETE':
        /**
         * Xóa bàn. URL: api/tables.php?id=5
         */
        if ($id) {
            echo json_encode($controller->delete($id));
        } else {
            echo json_encode(["success" => false, "message" => "Thiếu ID bàn cần xóa"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Phương thức không được hỗ trợ"]);
        break;
}