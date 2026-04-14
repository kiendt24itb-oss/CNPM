<?php
// BE/api/inventory.php
require_once __DIR__ . "/../controllers/inventory.php";
header("Content-Type: application/json; charset=utf-8");

$controller = new InventoryController();
$method = $_SERVER["REQUEST_METHOD"];
$id = isset($_GET['id']) ? intval($_GET['id']) : null;

switch ($method) {
    case 'GET':
        echo json_encode($controller->index());
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($controller->store($data));
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"), true);
        echo json_encode($controller->update($id, $data));
        break;

    case 'DELETE':
        echo json_encode($controller->delete($id));
        break;

    default:
        http_response_code(405);
        echo json_encode(["success" => false, "message" => "Phương thức không được hỗ trợ"]);
        break;
}