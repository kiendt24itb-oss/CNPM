<?php
class Database {
    private $host = "127.0.0.1";
    private $db_name = "coffee_management";
    private $username = "root";
    private $password = "101001";
    private $port = 3306;

    private static $instance = null;
    private $conn;

    public static function getInstance() {
        if (!self::$instance) {
            self::$instance = new Database();
        }
        return self::$instance;
    }

    public function connect() {
        if ($this->conn) {
            return $this->conn;
        }

        try {
            $this->conn = new mysqli(
                $this->host,
                $this->username,
                $this->password,
                $this->db_name,
                $this->port
            );

            if ($this->conn->connect_error) {
                throw new Exception("Kết nối thất bại: " . $this->conn->connect_error);
            }

            $this->conn->set_charset("utf8mb4");

        } catch (Exception $e) {
            http_response_code(500);
            echo json_encode([
                "success" => false,
                "message" => $e->getMessage()
            ]);
            exit;
        }

        return $this->conn;
    }
}