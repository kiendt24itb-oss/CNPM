<?php
require_once __DIR__ . "/../models/menu.php";
require_once __DIR__ . "/../middleware/authMiddleware.php"; 

class MenuController {
    private $menuModel;
    private $auth;

    public function __construct() {
        $this->menuModel = new Menu();
        $this->auth = new AuthMiddleware();
        
        // Tất cả nhân viên đều có thể xem Menu
        $this->auth->checkLogin(); 
    }

    /**
     * Lấy danh sách sản phẩm (Có hỗ trợ filter theo Category và Search)
     */
    public function index($params = []) {
        // Nếu có keyword tìm kiếm
        if (!empty($params['search'])) {
            $data = $this->menuModel->searchProducts($params['search']);
        } 
        // Nếu có lọc theo danh mục
        elseif (!empty($params['category_id'])) {
            $data = $this->menuModel->getProductsByCategory($params['category_id']);
        } 
        // Mặc định lấy tất cả
        else {
            $data = $this->menuModel->getAllProducts();
        }

        return [
            "success" => true,
            "data" => $data,
            "total" => count($data)
        ];
    }

    /**
     * Thêm sản phẩm mới (Chỉ Admin)
     */
    public function store($data, $file = null) {
    $this->auth->checkAdmin();

    if (empty($data['name']) || empty($data['price'])) {
        return ["success" => false, "message" => "Tên và giá không được để trống"];
    }

    // 1. Xử lý giá tiền: Ép kiểu về float để tránh lỗi "Out of range" nếu gửi chuỗi lạ
    // Đồng thời loại bỏ dấu chấm/phẩy nếu có
    $cleanPrice = str_replace(['.', ','], '', $data['price']);
    $cleanPrice = (float)$cleanPrice;

    // 2. Xử lý đường dẫn ảnh bằng đường dẫn tuyệt đối của hệ thống
    $imagePath = 'default-coffee.png'; 
    
    if ($file && $file['error'] === 0) {
        // Sử dụng $_SERVER['DOCUMENT_ROOT'] để trỏ thẳng vào thư mục htdocs/CNPM
        $targetDir = $_SERVER['DOCUMENT_ROOT'] . "/CNPM/assets/img/products/";
        
        // Tạo thư mục nếu chưa có
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0777, true);
        }

        // Làm sạch tên file (đổi khoảng trắng thành gạch dưới) để tránh lỗi stream
        $safeFileName = time() . "_" . str_replace(' ', '_', basename($file["name"]));
        $targetFilePath = $targetDir . $safeFileName;

        if (move_uploaded_file($file["tmp_name"], $targetFilePath)) {
            $imagePath = $safeFileName;
        }
    }

    // 3. Gọi Model lưu vào DB
    try {
        $result = $this->menuModel->addProduct(
            $data['name'], 
            $cleanPrice, 
            $imagePath, 
            $data['description'] ?? '', 
            $data['category_id'] ?? null, 
            $data['recipe_id'] ?? null
        );

        return $result 
            ? ["success" => true, "message" => "Thêm món mới thành công"]
            : ["success" => false, "message" => "Lỗi database khi thêm món"];
            
    } catch (mysqli_sql_exception $e) {
        // Trả về lỗi cụ thể nếu giá tiền vẫn quá lớn so với thiết kế DB
        return ["success" => false, "message" => "Lỗi dữ liệu: Giá tiền quá lớn hoặc không hợp lệ!"];
    }
}

    /**
     * Cập nhật món ăn
     */
    public function update($id, $data, $file = null) {
        $this->auth->checkAdmin();

        // Nếu có upload ảnh mới thì xử lý, không thì giữ nguyên ảnh cũ (cần logic lấy ảnh cũ ở đây)
        // Ở đây mình giả sử $data['image'] chứa tên ảnh cũ nếu không thay đổi
        $imagePath = $data['image'] ?? 'default-coffee.png';

        if ($file && $file['error'] === 0) {
            $targetDir = "../../assets/img/products/";
            $fileName = time() . "_" . basename($file["name"]);
            if (move_uploaded_file($file["tmp_name"], $targetDir . $fileName)) {
                $imagePath = $fileName;
            }
        }

        $cleanPrice = str_replace('.', '', $data['price']);

        $result = $this->menuModel->updateProduct(
            $id,
            $data['name'],
            $cleanPrice,
            $imagePath,
            $data['description'],
            $data['category_id'],
            $data['recipe_id']
        );

        return $result 
            ? ["success" => true, "message" => "Cập nhật món thành công"]
            : ["success" => false, "message" => "Cập nhật thất bại"];
    }

    /**
     * Xóa món (Chỉ Admin)
     */
    public function delete($id) {
        $this->auth->checkAdmin();
        
        $result = $this->menuModel->deleteProduct($id);
        
        return $result 
            ? ["success" => true, "message" => "Đã xóa món khỏi Menu"]
            : ["success" => false, "message" => "Không thể xóa món này"];
    }

    /**
     * Lấy dữ liệu bổ trợ cho Form (Categories & Recipes)
     */
    public function getFormData() {
        return [
            "success" => true,
            "categories" => $this->menuModel->getCategories(),
            "recipes" => $this->menuModel->getRecipes()
        ];
    }
}