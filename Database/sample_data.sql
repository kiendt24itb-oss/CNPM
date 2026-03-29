-- =====================================================
-- SAMPLE DATA
-- =====================================================
USE coffee_management;

-- Insert sample areas
INSERT INTO areas (area_name) VALUES
('Trong nhà'),
('Ban công'),
('Phòng VIP'),
('Sân vườn');

-- Insert sample categories
INSERT INTO categories (category_name) VALUES
('Cà phê'),
('Trà'),
('Nước ép'),
('Bánh ngọt'),
('Đồ ăn nhẹ');

-- Insert sample products
INSERT INTO products (product_name, price, category_id, description, status) VALUES
('Cà phê đen', 25000, 1, 'Cà phê đen nguyên chất', 'AVAILABLE'),
('Cà phê sữa', 30000, 1, 'Cà phê sữa đá', 'AVAILABLE'),
('Trà chanh', 25000, 2, 'Trà chanh tươi', 'AVAILABLE'),
('Nước cam ép', 35000, 3, 'Nước cam tươi ép', 'AVAILABLE'),
('Bánh ngọt', 45000, 4, 'Bánh ngọt các loại', 'AVAILABLE'),
('Bánh mì thịt', 35000, 5, 'Bánh mì thịt nướng', 'AVAILABLE');

-- Insert sample tables
INSERT INTO cafe_tables (table_name, area_id, capacity, status) VALUES
('Bàn 01', 1, 4, 'EMPTY'),
('Bàn 02', 1, 2, 'EMPTY'),
('Bàn 03', 2, 4, 'EMPTY'),
('Bàn 04', 3, 6, 'EMPTY'),
('Bàn 05', 4, 8, 'EMPTY');

-- Insert sample users (passwords are hashed for 'password123')
INSERT INTO users (username, full_name, email, password, role) VALUES
('admin', 'Administrator', 'admin@coffee.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'ADMIN'),
('staff1', 'Nguyễn Văn A', 'staff1@coffee.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'STAFF'),
('staff2', 'Trần Thị B', 'staff2@coffee.com', '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'STAFF');

-- Insert sample order
INSERT INTO orders (order_code, table_id, user_id, customer_name, customer_count, total_amount, status) VALUES
('ORD001', 1, 2, 'Khách vãng lai', 2, 55000, 'OPEN');

-- Insert sample order items
INSERT INTO order_items (order_id, product_id, quantity, price) VALUES
(1, 1, 1, 25000),
(1, 3, 1, 25000);

-- Update table status
UPDATE cafe_tables SET status = 'OCCUPIED' WHERE table_id = 1;