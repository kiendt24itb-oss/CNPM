<?php
// BE/middleware/authMiddleware.php

class AuthMiddleware {
    public function __construct() {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    /**
     * Kiểm tra đăng nhập
     */
    public function checkLogin() {
        if (empty($_SESSION['user'])) {
            http_response_code(401);
            header("Content-Type: application/json; charset=utf-8");
            echo json_encode([
                "success" => false,
                "message" => "Chưa đăng nhập"
            ]);
            exit(); // Dừng chương trình ngay lập tức
        }
        return $_SESSION['user'];
    }

    /**
     * Kiểm tra quyền Admin
     */
    public function checkAdmin() {
        $user = $this->checkLogin(); // Phải login mới check role được
        if ($user['role'] !== 'ADMIN') {
            http_response_code(403);
            header("Content-Type: application/json; charset=utf-8");
            echo json_encode([
                "success" => false,
                "message" => "Bạn không có quyền thực hiện hành động này (Yêu cầu Admin)"
            ]);
            exit();
        }
    }
}