const Product = require("../models/Product");

const ProductController = {
  // 1. Lấy danh sách tất cả món ăn (kèm tên danh mục)
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.getAll();
      res.status(200).json({
        success: true,
        data: products,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy danh sách sản phẩm",
        error: error.message,
      });
    }
  },

  // 2. Lấy chi tiết một món ăn bằng ID
  getProductById: async (req, res) => {
    try {
      const { id } = req.params;
      const product = await Product.getById(id);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Không tìm thấy món ăn này",
        });
      }

      res.status(200).json({
        success: true,
        data: product,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi lấy thông tin sản phẩm",
        error: error.message,
      });
    }
  },

  // 3. Thêm món mới vào Menu
  // Body gửi lên: { name, price, description, image, category_id, recipe_id }
  createProduct: async (req, res) => {
    try {
      const { name, price, category_id } = req.body;

      // Kiểm tra các trường bắt buộc
      if (!name || !price || !category_id) {
        return res.status(400).json({
          success: false,
          message: "Vui lòng nhập đầy đủ tên, giá và danh mục",
        });
      }

      const newProductId = await Product.create(req.body);

      res.status(201).json({
        success: true,
        message: "Thêm món mới thành công",
        productId: newProductId,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Lỗi khi tạo món ăn mới",
        error: error.message,
      });
    }
  },
};

module.exports = ProductController;