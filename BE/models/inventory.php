<?php
require_once __DIR__ . "/../config/database.php";

class Inventory {
    private $conn;

    public function __construct() {
        $this->conn = Database::getInstance()->connect();
    }

    // Lấy tất cả nguyên liệu trong kho
    public function getAllIngredients() {
        $sql = "SELECT * FROM ingredients ORDER BY status DESC, name ASC";
        $result = $this->conn->query($sql);
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        return $data;
    }

    // Tìm nguyên liệu theo ID
    public function getIngredientById($id) {
        $sql = "SELECT * FROM ingredients WHERE ingredient_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        $stmt->execute();
        return $stmt->get_result()->fetch_assoc();
    }

    // Thêm nguyên liệu mới
    public function addIngredient($name, $supplier, $unit, $stock_quantity, $min_stock) {
        $sql = "INSERT INTO ingredients (name, supplier, unit, stock_quantity, min_stock) 
                VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sssdd", $name, $supplier, $unit, $stock_quantity, $min_stock);
        return $stmt->execute();
    }

    // Cập nhật thông tin nguyên liệu
    public function updateIngredient($id, $name, $supplier, $unit, $min_stock) {
        $sql = "UPDATE ingredients SET name = ?, supplier = ?, unit = ?, min_stock = ? 
                WHERE ingredient_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sssdi", $name, $supplier, $unit, $min_stock, $id);
        return $stmt->execute();
    }

    // Cập nhật số lượng tồn kho (Nhập thêm hoặc xuất kho)
    // Lưu ý: Trigger trg_update_ingredient_status trong DB sẽ tự động cập nhật status (GOOD, LOW, OUT)
    public function updateStock($id, $quantity) {
        $sql = "UPDATE ingredients SET stock_quantity = ? WHERE ingredient_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("di", $quantity, $id);
        return $stmt->execute();
    }

    // Xóa nguyên liệu
    public function deleteIngredient($id) {
        $sql = "DELETE FROM ingredients WHERE ingredient_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    // Lấy danh sách nguyên liệu sắp hết (Cảnh báo LOW hoặc OUT)
    public function getLowStockAlert() {
        $sql = "SELECT * FROM ingredients WHERE status IN ('LOW', 'OUT')";
        $result = $this->conn->query($sql);
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        return $data;
    }

    // (Tùy chọn) Lấy công thức liên quan đến nguyên liệu
    public function getRecipesByIngredient($ingredient_id) {
        $sql = "SELECT r.recipe_name, rd.quantity 
                FROM recipes r
                JOIN recipe_details rd ON r.recipe_id = rd.recipe_id
                WHERE rd.ingredient_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $ingredient_id);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }
}