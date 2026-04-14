<?php
require_once __DIR__ . "/../config/database.php";

class User {
    private $conn;

    public function __construct() {
        $this->conn = Database::getInstance()->connect();
    }

    public function findByEmail($email) {
        $sql = "SELECT 
                    u.user_id, u.username, u.email, u.password, 
                    u.role AS user_role, u.staff_id,
                    s.name AS staff_name, s.phone AS staff_phone, s.role AS staff_role
                FROM users u
                LEFT JOIN staff s ON u.staff_id = s.staff_id
                WHERE u.email = ? LIMIT 1";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();
        return $result->fetch_assoc() ?: null;
    }

    public function verifyPassword($inputPassword, $dbPassword) {
        if (!$dbPassword) return false;
        // Dùng trim() để loại bỏ khoảng trắng thừa nếu có
        return trim($inputPassword) === trim($dbPassword);
    }

    public function create($username = null, $email, $password, $staff_id = null, $role = 'STAFF') {
        $sql = "INSERT INTO users (username, email, password, staff_id, role) VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sssis", $username, $email, $password, $staff_id, $role);
        return $stmt->execute();
    }
}