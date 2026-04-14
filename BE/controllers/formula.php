<?php
// BE/controllers/formula.php
require_once __DIR__ . "/../models/formula.php"; // Model Recipe mình vừa viết ở trên
require_once __DIR__ . "/../middleware/authMiddleware.php"; 

class FormulaController {
    private $recipeModel;
    private $auth;

    public function __construct() {
        $this->recipeModel = new Recipe();
        $this->auth = new AuthMiddleware();
        
        // Cả Staff và Admin đều phải đăng nhập mới được đụng vào công thức
        $this->auth->checkLogin(); 
    }

    /**
     * Xem danh sách tất cả công thức (Staff & Admin đều được)
     */
    public function index() {
        $recipes = $this->recipeModel->getAll();
        return [
            "success" => true,
            "data" => $recipes
        ];
    }

    /**
     * Xem chi tiết 1 công thức gồm cả nguyên liệu (Staff & Admin đều được)
     */
    public function show($id) {
        $recipe = $this->recipeModel->findWithDetails($id);
        if (!$recipe) {
            return ["success" => false, "message" => "Không tìm thấy công thức"];
        }
        return [
            "success" => true,
            "data" => $recipe
        ];
    }

    /**
     * Thêm mới công thức (Chỉ Admin)
     */
    public function store($data) {
        // Kiểm tra quyền Admin trước khi cho phép tạo mới
        $this->auth->checkAdmin(); 

        // Validate cơ bản
        if (empty($data['recipe_name'])) {
            return ["success" => false, "message" => "Tên công thức không được để trống"];
        }

        if (empty($data['ingredients']) || !is_array($data['ingredients'])) {
            return ["success" => false, "message" => "Công thức phải có ít nhất một nguyên liệu"];
        }

        // Gọi hàm tạo từ Model (hàm có transaction mình viết lúc nãy)
        $result = $this->recipeModel->createFullRecipe(
            $data['recipe_name'], 
            $data['note'] ?? '', 
            $data['ingredients'] // Mảng chứa các object {ingredient_id, quantity}
        );

        return $result 
            ? ["success" => true, "message" => "Tạo công thức thành công", "id" => $result]
            : ["success" => false, "message" => "Lỗi hệ thống khi tạo công thức"];
    }

    /**
     * Xóa công thức (Chỉ Admin)
     */
    public function delete($id) {
        $this->auth->checkAdmin();
        
        $result = $this->recipeModel->delete($id);
        
        return $result 
            ? ["success" => true, "message" => "Xóa công thức thành công"]
            : ["success" => false, "message" => "Không thể xóa công thức này"];
    }
}