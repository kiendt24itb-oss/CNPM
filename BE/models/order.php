<?php
require_once __DIR__ . "/../config/database.php";

class Order {
    private $conn;

    public function __construct() {
        $this->conn = Database::getInstance()->connect();
    }

    /**
     * Lấy dữ liệu khởi tạo cho Modal Add Order
     * Bao gồm: Bàn trống + Danh mục & Món ăn
     */
    public function getInitializeData() {
        $data = [
            'tables' => $this->getAvailableTables(),
            'menu' => $this->getFullMenu()
        ];
        return $data;
    }

    // 1. Lấy danh sách bàn ĐANG TRỐNG
    public function getAvailableTables() {
        $sql = "SELECT table_id, table_number, area, capacity 
                FROM tables 
                WHERE status = 'EMPTY' 
                ORDER BY area ASC, table_number ASC";
        $result = $this->conn->query($sql);
        
        $tables = [];
        while ($row = $result->fetch_assoc()) {
            $tables[] = $row;
        }
        return $tables;
    }

    // 2. Lấy danh sách món ăn từ menu (Kèm tên danh mục để dễ phân loại)
    public function getFullMenu() {
        $sql = "SELECT m.menu_id, m.name, m.price, m.image, c.category_name 
                FROM menu m
                LEFT JOIN categories c ON m.category_id = c.category_id
                ORDER BY c.category_name ASC, m.name ASC";
        $result = $this->conn->query($sql);

        $menu = [];
        while ($row = $result->fetch_assoc()) {
            $menu[] = $row;
        }
        return $menu;
    }

    // 3. Hàm lưu đơn hàng (Transaction)
    public function saveOrder($tableId, $customerName, $customerCount, $items, $isPaid = false) {
        $this->conn->begin_transaction();
        try {
            $total = 0;
            foreach ($items as $item) {
                $total += $item['price'] * $item['quantity'];
            }

            $status = $isPaid ? 'PAID' : 'UNPAID';
            $paid_at = $isPaid ? date('Y-m-d H:i:s') : null;

            // Insert Order
            $sql = "INSERT INTO orders (table_id, customer_name, customer_count, total, status, paid_at) 
                    VALUES (?, ?, ?, ?, ?, ?)";
            $stmt = $this->conn->prepare($sql);
            $stmt->bind_param("isidss", $tableId, $customerName, $customerCount, $total, $status, $paid_at);
            $stmt->execute();
            $orderId = $this->conn->insert_id;

            // Insert Order Items
            $sqlItem = "INSERT INTO order_items (order_id, menu_id, quantity, price) VALUES (?, ?, ?, ?)";
            $stmtItem = $this->conn->prepare($sqlItem);
            foreach ($items as $item) {
                $stmtItem->bind_param("iiid", $orderId, $item['menu_id'], $item['quantity'], $item['price']);
                $stmtItem->execute();
            }

            $this->conn->commit();
            return ["success" => true, "order_id" => $orderId];
        } catch (Exception $e) {
            $this->conn->rollback();
            return ["success" => false, "message" => $e->getMessage()];
        }
    }
}