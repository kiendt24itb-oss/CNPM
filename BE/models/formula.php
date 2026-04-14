<?php
require_once __DIR__ . "/../config/database.php";

class Recipe {
    private $conn;

    public function __construct() {
        $this->conn = Database::getInstance()->connect();
    }

    /**
     * Lấy danh sách tất cả công thức (chưa bao gồm chi tiết nguyên liệu)
     */
    public function getAll() {
        $sql = "SELECT * FROM recipes ORDER BY recipe_id DESC";
        $result = $this->conn->query($sql);
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        return $data;
    }

    /**
     * Lấy chi tiết một công thức và các nguyên liệu đi kèm
     */
    public function findWithDetails($recipe_id) {
        // 1. Lấy thông tin chung của recipe
        $sqlRecipe = "SELECT * FROM recipes WHERE recipe_id = ? LIMIT 1";
        $stmt = $this->conn->prepare($sqlRecipe);
        $stmt->bind_param("i", $recipe_id);
        $stmt->execute();
        $recipe = $stmt->get_result()->fetch_assoc();

        if (!$recipe) return null;

        // 2. Lấy danh sách nguyên liệu của recipe đó
        $sqlDetails = "SELECT rd.*, i.name as ingredient_name, i.unit 
                       FROM recipe_details rd
                       JOIN ingredients i ON rd.ingredient_id = i.ingredient_id
                       WHERE rd.recipe_id = ?";
        $stmtDetails = $this->conn->prepare($sqlDetails);
        $stmtDetails->bind_param("i", $recipe_id);
        $stmtDetails->execute();
        $detailsResult = $stmtDetails->get_result();
        
        $ingredients = [];
        while ($row = $detailsResult->fetch_assoc()) {
            $ingredients[] = $row;
        }

        $recipe['ingredients'] = $ingredients;
        return $recipe;
    }

    /**
     * Tạo mới một công thức hoàn chỉnh (Sử dụng Transaction để đảm bảo an toàn dữ liệu)
     * $data gồm: recipe_name, note và mảng ingredients [[id, quantity], ...]
     */
    public function createFullRecipe($recipe_name, $note, $ingredients = []) {
        // Bắt đầu Transaction vì cần insert vào 2 bảng
        $this->conn->begin_transaction();

        try {
            // 1. Insert vào bảng recipes
            $sql1 = "INSERT INTO recipes (recipe_name, note) VALUES (?, ?)";
            $stmt1 = $this->conn->prepare($sql1);
            $stmt1->bind_param("ss", $recipe_name, $note);
            $stmt1->execute();
            $recipe_id = $this->conn->insert_id;

            // 2. Insert các nguyên liệu vào bảng recipe_details
            if (!empty($ingredients)) {
                $sql2 = "INSERT INTO recipe_details (recipe_id, ingredient_id, quantity) VALUES (?, ?, ?)";
                $stmt2 = $this->conn->prepare($sql2);
                
                foreach ($ingredients as $item) {
                    $stmt2->bind_param("iid", $recipe_id, $item['ingredient_id'], $item['quantity']);
                    $stmt2->execute();
                }
            }

            // Nếu mọi thứ ok thì commit
            $this->conn->commit();
            return $recipe_id;

        } catch (Exception $e) {
            // Nếu lỗi thì rollback (hủy bỏ các lệnh đã chạy)
            $this->conn->rollback();
            error_log("Lỗi tạo công thức: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Xóa công thức (Database đã có ON DELETE CASCADE nên sẽ tự xóa details)
     */
    public function delete($recipe_id) {
        $sql = "DELETE FROM recipes WHERE recipe_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $recipe_id);
        return $stmt->execute();
    }
}