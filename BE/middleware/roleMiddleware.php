<?php
require_once __DIR__ . "/authMiddleware.php";

function checkRole($rolesAllowed = []) {
    $user = checkAuth(); // lấy luôn user từ checkAuth()

    if (empty($rolesAllowed)) {
        return $user; // không giới hạn role
    }

    if (!in_array($user['role'], $rolesAllowed)) {
        http_response_code(403);
        header("Content-Type: application/json; charset=utf-8");

        echo json_encode([
            "success" => false,
            "message" => "Không có quyền truy cập"
        ]);

        exit();
    }

    return $user;
}