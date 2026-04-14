<?php
require_once __DIR__ . "/../config/database.php";

class OrderModel {
    private $conn;

    public function __construct() {
        $this->conn = Database::getInstance()->connect();
    }

    // =========================================
    // 1. LẤY DANH SÁCH BÀN TRỐNG
    // =========================================
    public function getAvailableTables() {
        $sql = "SELECT * FROM tables 
                WHERE status = 'EMPTY'
                ORDER BY table_number ASC";

        $res = $this->conn->query($sql);
        return $res->fetch_all(MYSQLI_ASSOC);
    }

    // =========================================
    // 2. LẤY MENU (CHO DROPDOWN CHỌN MÓN)
    // =========================================
    public function getMenuItems() {
        $sql = "SELECT menu_id, name, price, image 
                FROM menu
                ORDER BY name ASC";

        $res = $this->conn->query($sql);
        return $res->fetch_all(MYSQLI_ASSOC);
    }

    // =========================================
    // 3. TẠO ORDER
    // =========================================
    public function createOrder($table_id, $customer_name, $customer_count, $status) {
        $sql = "INSERT INTO orders (table_id, customer_name, customer_count, status) 
                VALUES (?, ?, ?, ?)";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("isis", $table_id, $customer_name, $customer_count, $status);
        $stmt->execute();

        return $this->conn->insert_id; // trả về order_id
    }

    // =========================================
    // 4. THÊM ORDER ITEMS
    // =========================================
    public function addOrderItem($order_id, $menu_id, $quantity, $price) {
        $sql = "INSERT INTO order_items (order_id, menu_id, quantity, price) 
                VALUES (?, ?, ?, ?)";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("iiid", $order_id, $menu_id, $quantity, $price);
        return $stmt->execute();
    }

    // =========================================
    // 5. TÍNH VÀ CẬP NHẬT TOTAL
    // =========================================
    public function updateOrderTotal($order_id) {
        $sql = "UPDATE orders 
                SET total = (
                    SELECT SUM(quantity * price) 
                    FROM order_items 
                    WHERE order_id = ?
                )
                WHERE order_id = ?";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("ii", $order_id, $order_id);
        return $stmt->execute();
    }

    // =========================================
    // 6. TẠO ORDER FULL (DÙNG 1 LẦN)
    // =========================================
    public function createFullOrder($table_id, $customer_name, $customer_count, $status, $items) {
        $this->conn->begin_transaction();

        try {
            // 1. tạo order
            $order_id = $this->createOrder($table_id, $customer_name, $customer_count, $status);

            // 2. thêm items
            foreach ($items as $item) {
                $this->addOrderItem(
                    $order_id,
                    $item['menu_id'],
                    $item['quantity'],
                    $item['price']
                );
            }

            // 3. update total
            $this->updateOrderTotal($order_id);

            $this->conn->commit();

            return [
                "success" => true,
                "order_id" => $order_id
            ];

        } catch (Exception $e) {
            $this->conn->rollback();
            return [
                "success" => false,
                "error" => $e->getMessage()
            ];
        }
    }

    // =========================================
    // 7. LẤY DANH SÁCH ORDER (HIỂN THỊ GRID)
    // =========================================
    public function getOrders() {
        $sql = "SELECT o.*, t.table_number 
                FROM orders o
                LEFT JOIN tables t ON o.table_id = t.table_id
                ORDER BY o.created_at DESC";

        $res = $this->conn->query($sql);
        return $res->fetch_all(MYSQLI_ASSOC);
    }

    // =========================================
    // 8. LẤY CHI TIẾT ORDER
    // =========================================
    public function getOrderDetail($order_id) {
        $sql = "SELECT oi.*, m.name 
                FROM order_items oi
                JOIN menu m ON oi.menu_id = m.menu_id
                WHERE oi.order_id = ?";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $order_id);
        $stmt->execute();

        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    // =========================================
    // 9. THANH TOÁN
    // =========================================
    public function payOrder($order_id) {
        $sql = "UPDATE orders 
                SET status = 'PAID'
                WHERE order_id = ?";

        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $order_id);
        return $stmt->execute();
    }

    public function updateStatus($id, $status) {
    $sql = "UPDATE orders SET status = ? WHERE order_id = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("si", $status, $id);
    return $stmt->execute();
}

public function deleteOrder($id) {
    $sql = "DELETE FROM orders WHERE order_id = ?";
    $stmt = $this->conn->prepare($sql);
    $stmt->bind_param("i", $id);
    return $stmt->execute();
}
}