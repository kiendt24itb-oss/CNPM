-- =====================================================
-- DATABASE
-- =====================================================
CREATE DATABASE IF NOT EXISTS coffee_management
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE coffee_management;

-- =====================================================
-- USERS
-- =====================================================
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    full_name VARCHAR(150),
    email VARCHAR(150) UNIQUE,
    password VARCHAR(255),
    role ENUM('ADMIN','STAFF') DEFAULT 'STAFF',
    google_id VARCHAR(100) UNIQUE,
    provider ENUM('LOCAL','GOOGLE') DEFAULT 'LOCAL',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- KHU VỰC (NEW)
-- =====================================================
CREATE TABLE areas (
    area_id INT AUTO_INCREMENT PRIMARY KEY,
    area_name VARCHAR(100) NOT NULL -- Trong nhà, sân vườn...
);

-- =====================================================
-- BÀN (ĐÃ ĐÚNG YÊU CẦU)
-- =====================================================
CREATE TABLE cafe_tables (
    table_id INT AUTO_INCREMENT PRIMARY KEY,
    table_name VARCHAR(50) UNIQUE NOT NULL,
    area_id INT,
    capacity INT DEFAULT 4,
    note VARCHAR(255),
    status ENUM('EMPTY','OCCUPIED') DEFAULT 'EMPTY',

    FOREIGN KEY (area_id)
        REFERENCES areas(area_id)
        ON DELETE SET NULL
);

-- =====================================================
-- DANH MỤC
-- =====================================================
CREATE TABLE categories (
    category_id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL
);

-- =====================================================
-- MENU (ĐÃ NÂNG CẤP)
-- =====================================================
CREATE TABLE products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image_url VARCHAR(255), -- ảnh local
    description TEXT,
    category_id INT,
    status ENUM('AVAILABLE','OUT_OF_STOCK','HIDDEN') DEFAULT 'AVAILABLE',

    FOREIGN KEY (category_id)
        REFERENCES categories(category_id)
        ON DELETE SET NULL
);

-- =====================================================
-- NGUYÊN LIỆU
-- =====================================================
CREATE TABLE ingredients (
    ingredient_id INT AUTO_INCREMENT PRIMARY KEY,
    ingredient_name VARCHAR(100) NOT NULL,
    unit VARCHAR(20),
    stock_quantity DECIMAL(10,2) DEFAULT 0,
    min_stock DECIMAL(10,2) DEFAULT 10
);

-- =====================================================
-- CÔNG THỨC (LINK MENU → NGUYÊN LIỆU)
-- =====================================================
CREATE TABLE recipes (
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
-- ĐƠN HÀNG
-- =====================================================
CREATE TABLE orders (
    order_id INT AUTO_INCREMENT PRIMARY KEY,
    order_code VARCHAR(50) UNIQUE, -- mã đơn
    table_id INT,
    user_id INT,
    customer_name VARCHAR(150),
    customer_count INT DEFAULT 1,
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
-- CHI TIẾT ĐƠN
-- =====================================================
CREATE TABLE order_items (
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
        ON DELETE RESTRICT
);

-- =====================================================
-- THANH TOÁN
-- =====================================================
CREATE TABLE payments (
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
-- NHẬP KHO
-- =====================================================
CREATE TABLE import_logs (
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
-- INDEX (TỐI ƯU)
-- =====================================================
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_orders_table ON orders(table_id);
CREATE INDEX idx_products_category ON products(category_id);
