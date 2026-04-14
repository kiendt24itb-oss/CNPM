<?php
require_once __DIR__ . "/../controllers/AuthController.php";
header("Content-Type: application/json; charset=utf-8");

$auth = new AuthController();
$data = json_decode(file_get_contents("php://input"), true);

// Dùng trim() để loại bỏ khoảng trắng vô tình gõ nhầm
$email = trim($data["email"] ?? $_POST["email"] ?? '');
$password = trim($data["password"] ?? $_POST["password"] ?? '');

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    echo json_encode(["success" => false, "message" => "Method not allowed"]);
    exit;
}

$result = $auth->login($email, $password);
echo json_encode($result);