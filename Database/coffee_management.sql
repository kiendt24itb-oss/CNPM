CREATE DATABASE coffee_management
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE coffee_management;

-- ================= NHÂN VIÊN =================
CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    birth_date DATE,
    cccd VARCHAR(20) UNIQUE,
    phone VARCHAR(20),
    address VARCHAR(255),
    image VARCHAR(255),
    role ENUM('MANAGER','BARISTA','STAFF') DEFAULT 'STAFF',
    hire_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= USERS (LOGIN) =================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    staff_id INT NULL,
    role ENUM('ADMIN','STAFF') DEFAULT 'STAFF',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- ================= BÀN =================
CREATE TABLE tables (
    table_id INT AUTO_INCREMENT PRIMARY KEY,
    table_number INT UNIQUE NOT NULL,
    area ENUM('INDOOR','VIP','BALCONY','GARDEN'),
    capacity INT,
    status ENUM('EMPTY','OCCUPIED') DEFAULT 'EMPTY',
    note VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ================= DANH MỤC =================
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

-- ================= NGUYÊN LIỆU =================
CREATE TABLE ingredients (
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    supplier VARCHAR(150),
    unit VARCHAR(20),
    stock_quantity DECIMAL(10,2) DEFAULT 0,
    min_stock DECIMAL(10,2) DEFAULT 10,
    status ENUM('GOOD','LOW','OUT') DEFAULT 'GOOD'
);

-- ================= CÔNG THỨC =================
CREATE TABLE recipes (
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_name VARCHAR(150) NOT NULL,
    note VARCHAR(255)
);

CREATE TABLE recipe_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT,
    ingredient_id INT,
    quantity DECIMAL(10,2),

    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id) ON DELETE CASCADE
);

-- ================= MENU =================
CREATE TABLE menu (
    menu_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image VARCHAR(255),
    description TEXT,
    category_id INT NULL,
    recipe_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE SET NULL
);

-- ================= ORDERS =================
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    table_id INT NULL,
    customer_name VARCHAR(150),
    customer_count INT,
    total DECIMAL(10,2) DEFAULT 0,
    status ENUM('UNPAID','PAID') DEFAULT 'UNPAID',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP NULL,

    FOREIGN KEY (table_id) REFERENCES tables(table_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE
);

-- ================= ORDER ITEMS =================
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT,
    menu_id INT,
    quantity INT,
    price DECIMAL(10,2),

    FOREIGN KEY (order_id) REFERENCES orders(order_id)
    ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menu(menu_id)
    ON DELETE CASCADE
);

-- ======================================================
-- TRIGGERS AN TOÀN
-- ======================================================

DELIMITER //

-- Khi tạo order → bàn thành OCCUPIED
CREATE TRIGGER trg_after_insert_order
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    IF NEW.table_id IS NOT NULL THEN
        UPDATE tables
        SET status = 'OCCUPIED'
        WHERE table_id = NEW.table_id;
    END IF;
END//

-- Khi thanh toán → set paid_at
CREATE TRIGGER trg_before_update_order
BEFORE UPDATE ON orders
FOR EACH ROW
BEGIN
    IF NEW.status = 'PAID' AND OLD.status = 'UNPAID' THEN
        SET NEW.paid_at = CURRENT_TIMESTAMP;
    END IF;
END//

-- Khi xóa order → bàn trống lại
CREATE TRIGGER trg_after_delete_order
AFTER DELETE ON orders
FOR EACH ROW
BEGIN
    IF OLD.table_id IS NOT NULL THEN
        UPDATE tables
        SET status = 'EMPTY'
        WHERE table_id = OLD.table_id;
    END IF;
END//

-- Cập nhật trạng thái kho
CREATE TRIGGER trg_update_ingredient_status
BEFORE UPDATE ON ingredients
FOR EACH ROW
BEGIN
    IF NEW.stock_quantity IS NULL OR NEW.stock_quantity <= 0 THEN
        SET NEW.status = 'OUT';

    ELSEIF NEW.stock_quantity <= NEW.min_stock THEN
        SET NEW.status = 'LOW';

    ELSE
        SET NEW.status = 'GOOD';
    END IF;
END//

DELIMITER ;