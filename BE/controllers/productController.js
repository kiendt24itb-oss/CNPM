const Product = require("../models/Product");
const { sendResponse } = require("../utils/helpers");

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.getAllProducts();
    sendResponse(res, 200, products, "Lấy danh sách sản phẩm thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.getProductById(id);

    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    sendResponse(res, 200, product, "Lấy sản phẩm thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Create product (Admin only)
const createProduct = async (req, res) => {
  try {
    const { name, price, category, description, image } = req.body;

    const productId = await Product.createProduct(
      name,
      price,
      category,
      description,
      image,
    );

    sendResponse(res, 201, { id: productId }, "Thêm sản phẩm thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Update product (Admin only)
const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, price, category, description, image } = req.body;

    const product = await Product.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    await Product.updateProduct(id, name, price, category, description, image);

    sendResponse(res, 200, { id }, "Cập nhật sản phẩm thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Delete product (Admin only)
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.getProductById(id);
    if (!product) {
      return res.status(404).json({ message: "Sản phẩm không tồn tại" });
    }

    await Product.deleteProduct(id);

    sendResponse(res, 200, { id }, "Xóa sản phẩm thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Get products by category
const getProductsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const products = await Product.getProductsByCategory(category);

    sendResponse(res, 200, products, "Lấy sản phẩm theo danh mục thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
};
