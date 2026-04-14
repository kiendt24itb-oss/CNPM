<?php
require_once __DIR__ . "/../config/database.php";

class StaffModel {
    private $conn;

    public function __construct() {
        $this->conn = Database::getInstance()->connect();
    }

    /**
     * 1. Lấy toàn bộ danh sách nhân viên (cho ADMIN)
     */
    public function getAllStaff() {
        $sql = "SELECT s.*, u.email, u.role as user_role
                FROM staff s
                LEFT JOIN users u ON s.staff_id = u.staff_id
                ORDER BY s.staff_id ASC";

        $result = $this->conn->query($sql);
        return $result ? $result->fetch_all(MYSQLI_ASSOC) : [];
    }

    /**
     * 2. Lấy thông tin staff theo EMAIL (dùng khi login)
     */
    public function getStaffByEmail($email) {
        $sql = "SELECT s.*, u.email, u.role as user_role
                FROM users u
                LEFT JOIN staff s ON u.staff_id = s.staff_id
                WHERE u.email = ?";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $email);
        $stmt->execute();

        return $stmt->get_result()->fetch_assoc();
    }

    /**
     * 3. Nhân viên tự cập nhật thông tin của mình (dựa vào email)
     */
    public function updateOwnProfile($email, $name, $birth_date, $cccd, $phone, $address, $image) {
        $sql = "UPDATE staff s
                JOIN users u ON s.staff_id = u.staff_id
                SET 
                    s.name = ?, 
                    s.birth_date = ?, 
                    s.cccd = ?, 
                    s.phone = ?, 
                    s.address = ?, 
                    s.image = ?
                WHERE u.email = ?";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sssssss", $name, $birth_date, $cccd, $phone, $address, $image, $email);
        return $stmt->execute();
    }

    /**
     * 4. ADMIN cập nhật bất kỳ nhân viên nào
     */
    public function adminUpdateStaff($staff_id, $name, $birth_date, $cccd, $phone, $address, $role) {
        $sql = "UPDATE staff
                SET name = ?, birth_date = ?, cccd = ?, phone = ?, address = ?, role = ?
                WHERE staff_id = ?";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ssssssi", $name, $birth_date, $cccd, $phone, $address, $role, $staff_id);
        return $stmt->execute();
    }

    /**
     * 5. ADMIN xóa nhân viên
     */
    public function deleteStaff($staff_id) {
        $sql = "DELETE FROM staff WHERE staff_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $staff_id);
        return $stmt->execute();
    }

    /**
     * 6. Kiểm tra CCCD đã tồn tại chưa
     */
    public function isCCCDExists($cccd) {
        $sql = "SELECT staff_id FROM staff WHERE cccd = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $cccd);
        $stmt->execute();
        return $stmt->get_result()->num_rows > 0;
    }

    /**
     * 7. Thống kê số lượng nhân viên
     */
    public function getStaffStats() {
        $sql = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN role = 'MANAGER' THEN 1 ELSE 0 END) as manager,
                    SUM(CASE WHEN role = 'BARISTA' THEN 1 ELSE 0 END) as barista,
                    SUM(CASE WHEN role = 'STAFF' THEN 1 ELSE 0 END) as staff
                FROM staff";

        $res = $this->conn->query($sql);
        return $res->fetch_assoc();
    }
}