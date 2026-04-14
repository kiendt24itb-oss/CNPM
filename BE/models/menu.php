<?php
require_once __DIR__ . "/../config/database.php";

class Menu {
    private $conn;

    public function __construct() {
        $this->conn = Database::getInstance()->connect();
    }

    // 1. Lấy danh sách sản phẩm (kèm tên Category để hiển thị lên Grid)
    public function getAllProducts() {
        $sql = "SELECT m.*, c.category_name 
                FROM menu m
                LEFT JOIN categories c ON m.category_id = c.category_id
                ORDER BY m.created_at DESC";
        $result = $this->conn->query($sql);
        $data = [];
        while ($row = $result->fetch_assoc()) {
            $data[] = $row;
        }
        return $data;
    }

    // 2. Lấy sản phẩm theo Category (Dùng cho dropdown filter trong HTML)
    public function getProductsByCategory($categoryId) {
        $sql = "SELECT * FROM menu WHERE category_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $categoryId);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    // 3. Tìm kiếm sản phẩm (Dùng cho search-box trong HTML)
    public function searchProducts($keyword) {
        $keyword = "%" . $keyword . "%";
        $sql = "SELECT * FROM menu WHERE name LIKE ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("s", $keyword);
        $stmt->execute();
        return $stmt->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    // 4. Thêm sản phẩm mới (Khớp với form AddProduct.html)
    public function addProduct($name, $price, $image, $description, $categoryId, $recipeId) {
        $sql = "INSERT INTO menu (name, price, image, description, category_id, recipe_id) 
                VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($sql);
        // Lưu ý: price là decimal, category_id/recipe_id là int
        $stmt->bind_param("sdssii", $name, $price, $image, $description, $categoryId, $recipeId);
        return $stmt->execute();
    }

    // 5. Cập nhật sản phẩm
    public function updateProduct($id, $name, $price, $image, $description, $categoryId, $recipeId) {
        $sql = "UPDATE menu SET name = ?, price = ?, image = ?, description = ?, 
                category_id = ?, recipe_id = ? WHERE menu_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("sdssiii", $name, $price, $image, $description, $categoryId, $recipeId, $id);
        return $stmt->execute();
    }

    // 6. Xóa sản phẩm
    public function deleteProduct($id) {
        $sql = "DELETE FROM menu WHERE menu_id = ?";
        $stmt = $this->conn->prepare($sql);
        $stmt->bind_param("i", $id);
        return $stmt->execute();
    }

    // 7. Lấy thống kê (Cho phần header-row trong HTML)
    public function getMenuStats() {
        $sql = "SELECT COUNT(*) as total FROM menu";
        $res = $this->conn->query($sql);
        return $res->fetch_assoc();
    }

    // 8. Lấy danh sách danh mục để đổ vào Dropdown (Dùng cho AddProduct.js)
    public function getCategories() {
        $sql = "SELECT * FROM categories ORDER BY category_name ASC";
        $result = $this->conn->query($sql);
        $data = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        }
        return $data;
    }

    // 9. Lấy danh sách công thức để chọn khi thêm món
    public function getRecipes() {
        $sql = "SELECT recipe_id, recipe_name FROM recipes ORDER BY recipe_name ASC";
        $result = $this->conn->query($sql);
        $data = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $data[] = $row;
            }
        }
        return $data;
    }
}