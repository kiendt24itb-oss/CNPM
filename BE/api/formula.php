<?php
// BE/api/formula.php
require_once __DIR__ . "/../controllers/formula.php";
header("Content-Type: application/json; charset=utf-8");

$controller = new FormulaController();
$method = $_SERVER["REQUEST_METHOD"];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($method) {
    case 'GET':
        // Nếu có ID thì xem chi tiết, không thì xem danh sách
        if ($id) {
            echo json_encode($controller->show($id));
        } else {
            echo json_encode($controller->index());
        }
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($controller->store($data));
        break;

    case 'DELETE':
        if ($id) {
            echo json_encode($controller->delete($id));
        } else {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Thiếu ID công thức"]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Phương thức không được hỗ trợ"]);
        break;
}