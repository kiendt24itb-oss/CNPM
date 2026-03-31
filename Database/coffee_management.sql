-- =====================================================
-- DATABASE: QUẢN LÝ QUÁN CAFE
-- =====================================================
DROP DATABASE IF EXISTS coffee_management;
CREATE DATABASE coffee_management
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE coffee_management;

-- =====================================================
-- 1. STAFF (NHÂN VIÊN)
-- =====================================================
CREATE TABLE staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    cccd VARCHAR(20) UNIQUE, -- Căn cước công dân (Duy nhất)
    email VARCHAR(150) UNIQUE NOT NULL, 
    birth_date DATE,
    hire_date DATE DEFAULT (CURRENT_DATE),
    role VARCHAR(100) -- Chức vụ (Ví dụ: Pha chế, Phục vụ, Quản lý)
);

-- =====================================================
-- 2. USERS (TÀI KHOẢN ĐĂNG NHẬP)
-- =====================================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL, -- Liên kết với Email của Staff
    role ENUM('ADMIN', 'STAFF') DEFAULT 'STAFF',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Khóa ngoại liên kết tài khoản với thông tin nhân viên qua Email
    FOREIGN KEY (email) REFERENCES staff(email) ON DELETE CASCADE ON UPDATE CASCADE
);

-- =====================================================
-- 3. TABLES (BÀN)
-- =====================================================
CREATE TABLE tables (
    table_id INT AUTO_INCREMENT PRIMARY KEY,
    table_number INT NOT NULL,
    area ENUM('INDOOR','VIP','BALCONY','GARDEN'), -- Khu vực
    capacity INT, -- Sức chứa (số người)
    status ENUM('EMPTY','OCCUPIED') DEFAULT 'EMPTY', -- Trạng thái bàn
    note VARCHAR(255)
);

-- =====================================================
-- 4. CATEGORY (DANH MỤC MÓN ĂN/UỐNG)
-- =====================================================
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL -- Tên danh mục (Ví dụ: Cà phê, Trà, Bánh)
);

-- =====================================================
-- 5. INGREDIENTS (NGUYÊN LIỆU)
-- =====================================================
CREATE TABLE ingredients (
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    stock_quantity DECIMAL(10,2) DEFAULT 0, -- Số lượng tồn kho
    unit VARCHAR(20), -- Đơn vị tính (g, ml, kg)
    supplier VARCHAR(150), -- Nhà cung cấp
    min_stock DECIMAL(10,2) DEFAULT 10 -- Mức tồn tối thiểu để cảnh báo
);

-- =====================================================
-- 6. RECIPES (CÔNG THỨC PHA CHẾ)
-- =====================================================
CREATE TABLE recipes (
    recipe_id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_name VARCHAR(150) NOT NULL,
    note VARCHAR(255) -- Ghi chú cách làm
);

-- =====================================================
-- 7. RECIPE DETAILS (CHI TIẾT ĐỊNH MỨC NGUYÊN LIỆU)
-- =====================================================
CREATE TABLE recipe_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    recipe_id INT NOT NULL,
    ingredient_id INT NOT NULL,
    quantity DECIMAL(10,2) NOT NULL, -- Lượng nguyên liệu tiêu hao
    unit VARCHAR(20),

    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE CASCADE,
    FOREIGN KEY (ingredient_id) REFERENCES ingredients(ingredient_id) ON DELETE CASCADE
);

-- =====================================================
-- 8. MENU (THỰC ĐƠN)
-- =====================================================
CREATE TABLE menu (
    menu_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    image VARCHAR(255),
    category_id INT,
    recipe_id INT,

    FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
    FOREIGN KEY (recipe_id) REFERENCES recipes(recipe_id) ON DELETE SET NULL
);

-- =====================================================
-- 9. ORDERS (HÓA ĐƠN)
-- =====================================================
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    table_id INT,
    customer_name VARCHAR(150),
    customer_count INT,
    status ENUM('UNPAID','PAID') DEFAULT 'UNPAID', -- Trạng thái thanh toán
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMP NULL,

    FOREIGN KEY (table_id) REFERENCES tables(table_id) ON DELETE SET NULL
);

-- =====================================================
-- 10. ORDER ITEMS (CHI TIẾT MÓN TRONG HÓA ĐƠN)
-- =====================================================
CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    menu_id INT NOT NULL,
    quantity INT NOT NULL,

    FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
    FOREIGN KEY (menu_id) REFERENCES menu(menu_id) ON DELETE CASCADE
);

-- =====================================================
-- TRIGGER: TẠO ORDER → ĐỔI TRẠNG THÁI BÀN SANG 'CÓ KHÁCH'
-- =====================================================
DELIMITER //

CREATE TRIGGER trg_after_insert_order
AFTER INSERT ON orders
FOR EACH ROW
BEGIN
    IF NEW.table_id IS NOT NULL THEN
        UPDATE tables
        SET status = 'OCCUPIED'
        WHERE table_id = NEW.table_id;
    END IF;
END //

DELIMITER ;

-- =====================================================
-- TRIGGER: THANH TOÁN → TRỪ KHO NGUYÊN LIỆU
-- =====================================================
DELIMITER //

CREATE TRIGGER trg_after_update_order
AFTER UPDATE ON orders
FOR EACH ROW
BEGIN
    -- Khi trạng thái chuyển từ UNPAID sang PAID
    IF NEW.status = 'PAID' AND OLD.status = 'UNPAID' THEN

        -- Cập nhật trừ tồn kho dựa trên công thức món
        UPDATE ingredients i
        JOIN recipe_details rd ON i.ingredient_id = rd.ingredient_id
        JOIN menu m ON rd.recipe_id = m.recipe_id
        JOIN order_items oi ON oi.menu_id = m.menu_id
        SET i.stock_quantity = i.stock_quantity - (oi.quantity * rd.quantity)
        WHERE oi.order_id = NEW.order_id;

        -- Ghi nhận thời điểm thanh toán (Cập nhật trực tiếp vào bản ghi vừa update)
        -- Lưu ý: Trong thực tế nên dùng SET NEW.paid_at nếu là BEFORE UPDATE, 
        -- nhưng với AFTER UPDATE ta thực hiện lệnh UPDATE bổ sung.
        UPDATE orders
        SET paid_at = CURRENT_TIMESTAMP
        WHERE order_id = NEW.order_id;

    END IF;
END //

DELIMITER ;

-- =====================================================
-- TRIGGER: XOÁ ORDER → TRẢ BÀN VỀ TRẠNG THÁI 'TRỐNG'
-- =====================================================
DELIMITER //

CREATE TRIGGER trg_after_delete_order
AFTER DELETE ON orders
FOR EACH ROW
BEGIN
    IF OLD.table_id IS NOT NULL THEN
        UPDATE tables
        SET status = 'EMPTY'
        WHERE table_id = OLD.table_id;
    END IF;
END //

DELIMITER ;