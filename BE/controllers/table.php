<?php
require_once __DIR__ . "/../models/Table.php";
require_once __DIR__ . "/../middleware/authMiddleware.php";

class TableController {
    private $tableModel;
    private $auth;

    public function __construct() {
        $this->tableModel = new TableModel();
        $this->auth = new AuthMiddleware();
        
        // Mọi nhân viên đều có thể xem sơ đồ bàn
        $this->auth->checkLogin();
    }

    /**
     * Lấy danh sách bàn kèm thông tin đơn hàng (Số khách, Số món)
     * Hỗ trợ tìm kiếm và lọc theo trạng thái
     */
    public function index($params = []) {
        // 1. Nếu có keyword tìm kiếm (theo số bàn hoặc khu vực)
        if (!empty($params['search'])) {
            $data = $this->tableModel->searchTables($params['search']);
        } 
        // 2. Nếu có lọc theo trạng thái (EMPTY, OCCUPIED)
        elseif (!empty($params['status'])) {
            // Chuyển đổi trạng thái từ tiếng Việt (Giao diện) sang Enum (Database) nếu cần
            $statusMap = [
                'Trống' => 'EMPTY',
                'Đang dùng' => 'OCCUPIED'
            ];
            $dbStatus = $statusMap[$params['status']] ?? $params['status'];
            $data = $this->tableModel->getTablesByStatus($dbStatus);
        } 
        // 3. Mặc định lấy tất cả
        else {
            $data = $this->tableModel->getAllTablesWithOrders();
        }

        // Lấy thêm thống kê tổng quan để cập nhật header-row
        $stats = $this->tableModel->getTableStats();

        return [
            "success" => true,
            "data" => $data,
            "stats" => [
                "total" => $stats['total'] ?? 0,
                "occupied" => $stats['occupied'] ?? 0
            ]
        ];
    }

    /**
     * Thêm bàn mới (Chỉ Admin mới có quyền)
     */
    public function store($data) {
        $this->auth->checkAdmin();

        // Kiểm tra dữ liệu đầu vào
        if (empty($data['table_number']) || empty($data['area'])) {
            return ["success" => false, "message" => "Số bàn và khu vực không được để trống"];
        }

        // Kiểm tra xem số bàn đã tồn tại chưa
        if ($this->tableModel->isTableNumberExists($data['table_number'])) {
            return ["success" => false, "message" => "Số bàn này đã tồn tại trong hệ thống"];
        }

        try {
            $result = $this->tableModel->addTable(
                $data['table_number'],
                $data['area'],
                $data['capacity'] ?? 4,
                $data['note'] ?? ''
            );

            return $result 
                ? ["success" => true, "message" => "Thêm bàn mới thành công"]
                : ["success" => false, "message" => "Lỗi database khi thêm bàn"];

        } catch (Exception $e) {
            return ["success" => false, "message" => "Có lỗi xảy ra: " . $e->getMessage()];
        }
    }

    /**
     * Cập nhật thông tin bàn hoặc trạng thái dọn dẹp
     */
    public function update($id, $data) {
        $this->auth->checkAdmin();

        if (empty($id)) {
            return ["success" => false, "message" => "Thiếu ID bàn cần cập nhật"];
        }

        $result = $this->tableModel->updateTable(
            $id,
            $data['table_number'],
            $data['area'],
            $data['capacity'],
            $data['note'],
            $data['status']
        );

        return $result 
            ? ["success" => true, "message" => "Cập nhật thông tin bàn thành công"]
            : ["success" => false, "message" => "Cập nhật thất bại"];
    }

    /**
     * Xóa bàn (Chỉ Admin)
     */
    public function delete($id) {
        $this->auth->checkAdmin();

        // Không cho xóa nếu bàn đang có khách (OCCUPIED)
        // Bạn có thể bổ sung logic check trạng thái bàn trước khi xóa ở đây

        $result = $this->tableModel->deleteTable($id);
        
        return $result 
            ? ["success" => true, "message" => "Đã xóa bàn khỏi hệ thống"]
            : ["success" => false, "message" => "Không thể xóa bàn này"];
    }

    /**
     * API phụ để lấy danh sách khu vực đổ vào Select box
     */
    public function getAreas() {
        return [
            "success" => true,
            "areas" => ['INDOOR', 'VIP', 'BALCONY', 'GARDEN']
        ];
    }
}