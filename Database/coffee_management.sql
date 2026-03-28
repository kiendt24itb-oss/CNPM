-- =====================================================
-- DATABASE QUẢN LÝ QUÁN CÀ PHÊ
-- =====================================================

CREATE DATABASE IF NOT EXISTS coffee_management
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE coffee_management;

-- =====================================================
-- USERS (HỖ TRỢ LOCAL + GOOGLE LOGIN)
-- =====================================================

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    fullName VARCHAR(150),
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255),
    role ENUM('ADMIN','STAFF') DEFAULT 'STAFF',
    google_id VARCHAR(100) UNIQUE,
    provider ENUM('LOCAL','GOOGLE') DEFAULT 'LOCAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- DANH MỤC MÓN
-- =====================================================

CREATE TABLE IF NOT EXISTS categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

-- =====================================================
-- MENU
-- =====================================================

CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    category_id INT,
    status ENUM('AVAILABLE','OUT_OF_STOCK','HIDDEN') DEFAULT 'AVAILABLE',
    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE SET NULL
);

-- =====================================================
-- BÀN
-- =====================================================

CREATE TABLE IF NOT EXISTS cafe_tables (
    table_id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    capacity INT DEFAULT 4,
    status ENUM('EMPTY','OCCUPIED') DEFAULT 'EMPTY'
);

-- =====================================================
-- ĐƠN HÀNG
-- =====================================================

CREATE TABLE IF NOT EXISTS orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    table_id INT,
    user_id INT,
    total_amount DECIMAL(10,2) DEFAULT 0,
    order_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    status ENUM('OPEN','PAID','CANCELLED') DEFAULT 'OPEN',
    FOREIGN KEY (table_id)
        REFERENCES cafe_tables(table_id)
        ON DELETE SET NULL,
    FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE SET NULL
);

-- =====================================================
-- CHI TIẾT ĐƠN HÀNG
-- =====================================================

CREATE TABLE IF NOT EXISTS order_items (
    order_item_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    product_id INT,
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    note VARCHAR(255),
    FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE,
    FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE SET NULL
);

-- =====================================================
-- THANH TOÁN
-- =====================================================

CREATE TABLE IF NOT EXISTS payments (
    payment_id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT UNIQUE,
    total_amount DECIMAL(10,2),
    payment_time DATETIME DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50),
    FOREIGN KEY (order_id)
        REFERENCES orders(order_id)
        ON DELETE CASCADE
);

-- =====================================================
-- NGUYÊN LIỆU
-- =====================================================

CREATE TABLE IF NOT EXISTS ingredients (
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    ingredient_name VARCHAR(100) NOT NULL,
    unit VARCHAR(20),
    stock_quantity DECIMAL(10,2) DEFAULT 0,
    min_stock DECIMAL(10,2) DEFAULT 10
);

-- =====================================================
-- CÔNG THỨC
-- =====================================================

CREATE TABLE IF NOT EXISTS recipes (
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT,
    ingredient_id INT,
    quantity DECIMAL(10,2),
    UNIQUE(product_id, ingredient_id),
    FOREIGN KEY (product_id)
        REFERENCES products(product_id)
        ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id)
        REFERENCES ingredients(ingredient_id)
        ON DELETE CASCADE
);

-- =====================================================
-- NHẬP KHO
-- =====================================================

CREATE TABLE IF NOT EXISTS import_logs (
    import_id INT AUTO_INCREMENT PRIMARY KEY,
    ingredient_id INT,
    quantity DECIMAL(10,2),
    import_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    note VARCHAR(255),
    FOREIGN KEY (ingredient_id)
        REFERENCES ingredients(ingredient_id)
        ON DELETE CASCADE
);

-- =====================================================
-- TRIGGER TRỪ KHO
-- =====================================================

DELIMITER $$

CREATE TRIGGER deduct_stock_after_order
BEFORE INSERT ON order_items
FOR EACH ROW
BEGIN
    DECLARE insufficient INT;

    SELECT COUNT(*) INTO insufficient
    FROM ingredients i
    JOIN recipes r ON i.ingredient_id = r.ingredient_id
    WHERE r.product_id = NEW.product_id
    AND i.stock_quantity < (r.quantity * NEW.quantity);

    IF insufficient > 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Khong du nguyen lieu';
    END IF;

    UPDATE ingredients i
    JOIN recipes r ON i.ingredient_id = r.ingredient_id
    SET i.stock_quantity =
        i.stock_quantity - (r.quantity * NEW.quantity)
    WHERE r.product_id = NEW.product_id;

END$$

DELIMITER ;

-- =====================================================
-- TRIGGER HOÀN KHO
-- =====================================================

DELIMITER $$

CREATE TRIGGER restore_stock_after_delete
AFTER DELETE ON order_items
FOR EACH ROW
BEGIN
    UPDATE ingredients i
    JOIN recipes r ON i.ingredient_id = r.ingredient_id
    SET i.stock_quantity =
        i.stock_quantity + (r.quantity * OLD.quantity)
    WHERE r.product_id = OLD.product_id;
END$$

DELIMITER ;

-- =====================================================
-- VIEWS
-- =====================================================

CREATE OR REPLACE VIEW revenue_by_day AS
SELECT DATE(payment_time) AS ngay,
       SUM(total_amount) AS doanh_thu
FROM payments
GROUP BY DATE(payment_time);

CREATE OR REPLACE VIEW revenue_last_7_days AS
SELECT DATE(payment_time) AS ngay,
       SUM(total_amount) AS doanh_thu
FROM payments
WHERE payment_time >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
GROUP BY DATE(payment_time)
ORDER BY ngay;

CREATE OR REPLACE VIEW today_revenue AS
SELECT SUM(total_amount) AS doanh_thu_hom_nay
FROM payments
WHERE DATE(payment_time) = CURDATE();

CREATE OR REPLACE VIEW best_selling_products AS
SELECT p.product_name,
       SUM(oi.quantity) AS so_luong_ban
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
GROUP BY oi.product_id
ORDER BY so_luong_ban DESC;

CREATE OR REPLACE VIEW low_stock_ingredients AS
SELECT ingredient_name,
       stock_quantity
FROM ingredients
WHERE stock_quantity < min_stock;

CREATE OR REPLACE VIEW today_orders AS
SELECT COUNT(*) AS tong_don
FROM orders
WHERE DATE(order_time) = CURDATE();

CREATE OR REPLACE VIEW empty_tables AS
SELECT COUNT(*) AS ban_trong
FROM cafe_tables
WHERE status = 'EMPTY';

CREATE OR REPLACE VIEW total_staff AS
SELECT COUNT(*) AS tong_nhan_vien
FROM users
WHERE role = 'STAFF';