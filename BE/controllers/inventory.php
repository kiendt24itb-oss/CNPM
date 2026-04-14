<?php
// BE/controllers/inventory.php
require_once __DIR__ . "/../models/inventory.php";
require_once __DIR__ . "/../middleware/authMiddleware.php"; 

class InventoryController {
    private $inventoryModel;
    private $auth;

    public function __construct() {
        $this->inventoryModel = new Inventory();
        $this->auth = new AuthMiddleware();
        
        // Luôn kiểm tra đăng nhập khi khởi tạo bất kỳ thao tác kho nào
        $this->auth->checkLogin(); 
    }

    /**
     * Xem danh sách (Staff & Admin)
     */
    public function index() {
        $ingredients = $this->inventoryModel->getAllIngredients();
        return [
            "success" => true,
            "data" => $ingredients
        ];
    }

    /**
     * Thêm mới (Chỉ Admin)
     */
    public function store($data) {
        $this->auth->checkAdmin(); // Kiểm tra quyền admin trước khi làm

        if (empty($data['name']) || empty($data['unit'])) {
            return ["success" => false, "message" => "Tên và đơn vị không được để trống"];
        }

        $result = $this->inventoryModel->addIngredient(
            $data['name'], 
            $data['supplier'] ?? '', 
            $data['unit'], 
            $data['stock_quantity'] ?? 0, 
            $data['min_stock'] ?? 10
        );

        return $result 
            ? ["success" => true, "message" => "Thêm nguyên liệu thành công"]
            : ["success" => false, "message" => "Lỗi khi thêm nguyên liệu"];
    }

    /**
     * Cập nhật (Chỉ Admin)
     */
    public function update($id, $data) {
        $this->auth->checkAdmin();

        $result = $this->inventoryModel->updateIngredient(
            $id, 
            $data['name'], 
            $data['supplier'], 
            $data['unit'], 
            $data['min_stock']
        );

        return $result 
            ? ["success" => true, "message" => "Cập nhật thành công"]
            : ["success" => false, "message" => "Cập nhật thất bại"];
    }

    /**
     * Xóa (Chỉ Admin)
     */
    public function delete($id) {
        $this->auth->checkAdmin();
        $result = $this->inventoryModel->deleteIngredient($id);
        
        return $result 
            ? ["success" => true, "message" => "Xóa thành công"]
            : ["success" => false, "message" => "Xóa thất bại"];
    }
}