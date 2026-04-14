<?php
require_once __DIR__ . "/../controllers/menu.php";

// Thiết lập Header để làm việc với JSON và CORS nếu cần
header("Content-Type: application/json; charset=utf-8");

$controller = new MenuController();
$method = $_SERVER["REQUEST_METHOD"];

// Lấy các tham số từ URL
$id = isset($_GET['id']) ? intval($_GET['id']) : null;
$category_id = isset($_GET['category_id']) ? intval($_GET['category_id']) : null;
$search = isset($_GET['search']) ? $_GET['search'] : null;

switch ($method) {
    case 'GET':
        // Nếu URL có ?action=form-data thì lấy list categories/recipes để đổ vào select
        if (isset($_GET['action']) && $_GET['action'] === 'form-data') {
            echo json_encode($controller->getFormData());
        } else {
            // Lấy danh sách (có kèm search hoặc category_id nếu có)
            echo json_encode($controller->index([
                'category_id' => $category_id,
                'search' => $search
            ]));
        }
        break;

    case 'POST':
        /**
         * Với Menu, chúng ta dùng $_POST thay vì json_decode vì có thể có file ảnh.
         * Dữ liệu từ HTML Form gửi qua FormData sẽ nằm trong $_POST và $_FILES.
         */
        $data = $_POST; 
        $file = isset($_FILES['image']) ? $_FILES['image'] : null;
        
        echo json_encode($controller->store($data, $file));
        break;

    case 'PUT':
        /**
         * PHP hơi khó chịu với PUT và multipart/form-data. 
         * Một mẹo nhỏ là dùng POST và thêm một field _method = 'PUT' 
         * Hoặc nếu chỉ cập nhật JSON thì dùng như dưới đây:
         */
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($controller->update($id, $data));
        break;

    case 'DELETE':
        if ($id) {
            echo json_encode($controller->delete($id));
        } else {
            echo json_encode(["success" => false, "message" => "Thiếu ID sản phẩm"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Phương thức không được hỗ trợ"]);
        break;
}