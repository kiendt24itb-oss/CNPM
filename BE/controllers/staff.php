<?php
require_once __DIR__ . "/../models/Staff.php";
require_once __DIR__ . "/../middleware/authMiddleware.php";

class StaffController {
    private $staffModel;
    private $auth;

    public function __construct() {
        $this->staffModel = new StaffModel();
        $this->auth = new AuthMiddleware();

        // bắt buộc login
        $this->auth->checkLogin();
    }

    // =====================================================
    // 1. ADMIN: LẤY DANH SÁCH NHÂN VIÊN
    // =====================================================
    public function index() {
        $this->auth->checkAdmin();

        try {
            $data = $this->staffModel->getAllStaff();

            return [
                "success" => true,
                "data" => $data,
                "total" => count($data)
            ];
        } catch (Exception $e) {
            return [
                "success" => false,
                "message" => "Không thể lấy danh sách nhân viên"
            ];
        }
    }

    // =====================================================
    // 2. NHÂN VIÊN: LẤY PROFILE THEO SESSION LOGIN
    // =====================================================
    public function profile() {
        try {
            $user = $_SESSION['user'] ?? null;

            if (!$user || empty($user['email'])) {
                return [
                    "success" => false,
                    "message" => "Chưa đăng nhập"
                ];
            }

            $email = $user['email'];
            $data = $this->staffModel->getStaffByEmail($email);

            return [
                "success" => true,
                "data" => $data
            ];
        } catch (Exception $e) {
            return [
                "success" => false,
                "message" => "Không thể lấy thông tin cá nhân"
            ];
        }
    }

    // =====================================================
    // 3. NHÂN VIÊN: TỰ CẬP NHẬT THÔNG TIN
    // =====================================================
    public function updateProfile($data) {
        try {
            $user = $_SESSION['user'] ?? null;

            if (!$user || empty($user['email'])) {
                return [
                    "success" => false,
                    "message" => "Chưa đăng nhập"
                ];
            }

            $email = $user['email'];

            if (empty($data['name'])) {
                return [
                    "success" => false,
                    "message" => "Tên không được để trống"
                ];
            }

            // check CCCD trùng
            if (!empty($data['cccd']) && $this->staffModel->isCCCDExists($data['cccd'])) {
                return [
                    "success" => false,
                    "message" => "CCCD đã tồn tại"
                ];
            }

            $result = $this->staffModel->updateOwnProfile(
                $email,
                $data['name'],
                $data['birth_date'] ?? null,
                $data['cccd'] ?? null,
                $data['phone'] ?? null,
                $data['address'] ?? null,
                $data['image'] ?? null
            );

            return $result
                ? ["success" => true, "message" => "Cập nhật thành công"]
                : ["success" => false, "message" => "Cập nhật thất bại"];

        } catch (Exception $e) {
            return [
                "success" => false,
                "message" => "Lỗi update: " . $e->getMessage()
            ];
        }
    }

    // =====================================================
    // 4. ADMIN: UPDATE NHÂN VIÊN
    // =====================================================
    public function update($id, $data) {
        $this->auth->checkAdmin();

        if (empty($id)) {
            return [
                "success" => false,
                "message" => "Thiếu ID"
            ];
        }

        try {
            $result = $this->staffModel->adminUpdateStaff(
                $id,
                $data['name'] ?? '',
                $data['birth_date'] ?? null,
                $data['cccd'] ?? null,
                $data['phone'] ?? null,
                $data['address'] ?? null,
                $data['role'] ?? 'STAFF'
            );

            return $result
                ? ["success" => true, "message" => "Cập nhật thành công"]
                : ["success" => false, "message" => "Cập nhật thất bại"];

        } catch (Exception $e) {
            return [
                "success" => false,
                "message" => "Lỗi: " . $e->getMessage()
            ];
        }
    }

    // =====================================================
    // 5. ADMIN: XÓA NHÂN VIÊN
    // =====================================================
    public function delete($id) {
        $this->auth->checkAdmin();

        if (empty($id)) {
            return [
                "success" => false,
                "message" => "Thiếu ID"
            ];
        }

        try {
            $result = $this->staffModel->deleteStaff($id);

            return $result
                ? ["success" => true, "message" => "Đã xóa nhân viên"]
                : ["success" => false, "message" => "Xóa thất bại"];

        } catch (Exception $e) {
            return [
                "success" => false,
                "message" => "Lỗi xóa: " . $e->getMessage()
            ];
        }
    }

    // =====================================================
    // 6. ADMIN: THỐNG KÊ NHÂN VIÊN
    // =====================================================
    public function stats() {
        $this->auth->checkAdmin();

        try {
            $data = $this->staffModel->getStaffStats();

            return [
                "success" => true,
                "data" => $data
            ];
        } catch (Exception $e) {
            return [
                "success" => false,
                "message" => "Không thể lấy thống kê"
            ];
        }
    }
}