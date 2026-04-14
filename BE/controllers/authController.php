<?php
require_once __DIR__ . "/../models/User.php";

class AuthController {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    public function login($email, $password) {
        if (empty($email) || empty($password)) {
            return ["success" => false, "message" => "Thiếu email hoặc mật khẩu"];
        }

        $user = $this->userModel->findByEmail($email);

        if (!$user) {
            return ["success" => false, "message" => "Email không tồn tại"];
        }

        if (!$this->userModel->verifyPassword($password, $user["password"])) {
            return ["success" => false, "message" => "Sai mật khẩu"];
        }

        $_SESSION["user"] = [
            "id" => $user["user_id"],
            "username" => $user["username"],
            "email" => $user["email"],
            "role" => $user["user_role"],
            "staff" => $user["staff_id"] ? [
                "id" => $user["staff_id"],
                "name" => $user["staff_name"],
                "role" => $user["staff_role"]
            ] : null
        ];

        return [
            "success" => true,
            "message" => "Đăng nhập thành công",
            "user" => $_SESSION["user"]
        ];
    }

    public function logout() {
        $_SESSION = [];
        session_destroy();
        return ["success" => true, "message" => "Đăng xuất thành công"];
    }
}