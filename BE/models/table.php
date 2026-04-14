<?php
require_once __DIR__ . "/../config/database.php";

class TableModel {
    private $conn;

    public function __construct() {
        $this->conn = Database::getInstance()->connect();
    }

    /**
     * 1. Lấy danh sách tất cả bàn kèm thông tin đơn hàng hiện tại (Số khách, Số món)
     * Phục vụ hiển thị Grid Table ngoài giao diện chính.
     */
    public function getAllTablesWithOrders() {
        $sql = "SELECT 
                    t.*, 
                    o.order_id,
                    o.customer_count,
                    (SELECT SUM(quantity) FROM order_items WHERE order_id = o.order_id) as total_items
                FROM tables t
                LEFT JOIN orders o ON t.table_id = o.table_id AND o.status = 'UNPAID'
                ORDER BY t.table_number ASC";
        
        $result = $this->conn->query($sql);
        $data = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                // Ép kiểu dữ liệu về số để dễ xử lý ở Frontend
                $row['customer_count'] = $row['customer_count'] ? (int)$row['customer_count'] : 0;
                $row['total_items'] = $row['total_items'] ? (int)$row['total_items'] : 0;
                $data[] = $row;
            }
        }
        return $data;
    }

    /**
     * 2. Tìm kiếm bàn theo số bàn hoặc khu vực
     */
    public function searchTables($keyword) {
        $keyword = "%" . $keyword . "%";
        $sql = "SELECT 
                    t.*, 
                    o.customer_count,
                    (SELECT SUM(quantity) FROM order_items WHERE order_id = o.order_id) as total_items
                FROM tables t
                LEFT JOIN orders o ON t.table_id = o.table_id AND o.status = 'UNPAID'
                WHERE t.table_number LIKE ? OR t.area LIKE ?
                ORDER BY t.table_number ASC";
        
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ss", $keyword, $keyword);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    /**
     * 3. Lọc bàn theo trạng thái (EMPTY, OCCUPIED)
     */
    public function getTablesByStatus($status) {
        $sql = "SELECT t.*, o.customer_count,
                (SELECT SUM(quantity) FROM order_items WHERE order_id = o.order_id) as total_items
                FROM tables t
                LEFT JOIN orders o ON t.table_id = o.table_id AND o.status = 'UNPAID'
                WHERE t.status = ?
                ORDER BY t.table_number ASC";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $status);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    /**
     * 4. Thêm bàn mới (Khớp với form AddTable.html)
     */
    public function addTable($table_number, $area, $capacity, $note) {
        $sql = "INSERT INTO tables (table_number, area, capacity, note) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("isis", $table_number, $area, $capacity, $note);
        return $stmt->execute();
    }

    /**
     * 5. Cập nhật thông tin bàn
     */
    public function updateTable($id, $table_number, $area, $capacity, $note, $status) {
        $sql = "UPDATE tables SET table_number = ?, area = ?, capacity = ?, note = ?, status = ? 
                WHERE table_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("isissi", $table_number, $area, $capacity, $note, $status, $id);
        return $stmt->execute();
    }

    /**
     * 6. Xóa bàn
     */
    public function deleteTable($id) {
        $sql = "DELETE FROM tables WHERE table_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    /**
     * 7. Lấy thống kê số lượng bàn (Cho header-row)
     */
    public function getTableStats() {
        $sql = "SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'OCCUPIED' THEN 1 ELSE 0 END) as occupied
                FROM tables";
        $res = $this->conn->query($sql);
        return $res->fetch_assoc();
    }

    /**
     * 8. Kiểm tra xem số bàn đã tồn tại chưa (Dùng khi thêm mới)
     */
    public function isTableNumberExists($table_number) {
        $sql = "SELECT table_id FROM tables WHERE table_number = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $table_number);
        $stmt->execute();
        return $stmt->get_result()->num_rows > 0;
    }
}