const Table = require("../models/Table");
const { sendResponse } = require("../utils/helpers");

// Get all tables
const getAllTables = async (req, res) => {
  try {
    const tables = await Table.getAllTables();
    sendResponse(res, 200, tables, "Lấy danh sách bàn thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Get table by ID
const getTableById = async (req, res) => {
  try {
    const { id } = req.params;
    const table = await Table.getTableById(id);

    if (!table) {
      return res.status(404).json({ message: "Bàn không tồn tại" });
    }

    sendResponse(res, 200, table, "Lấy bàn thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Create table
const createTable = async (req, res) => {
  try {
    const { name, areaId, capacity, note } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Tên bàn là bắt buộc" });
    }

    const tableId = await Table.createTable(name, areaId, capacity, note);

    sendResponse(res, 201, { id: tableId }, "Thêm bàn thành công");
  } catch (error) {
    console.error(error);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "Tên bàn đã tồn tại" });
    } else {
      res.status(500).json({ message: "Lỗi server" });
    }
  }
};

// Update table
const updateTable = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, areaId, capacity, note, status } = req.body;

    const table = await Table.getTableById(id);
    if (!table) {
      return res.status(404).json({ message: "Bàn không tồn tại" });
    }

    await Table.updateTable(id, name, areaId, capacity, note, status);

    sendResponse(res, 200, { id }, "Cập nhật bàn thành công");
  } catch (error) {
    console.error(error);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ message: "Tên bàn đã tồn tại" });
    } else {
      res.status(500).json({ message: "Lỗi server" });
    }
  }
};

// Delete table
const deleteTable = async (req, res) => {
  try {
    const { id } = req.params;

    const table = await Table.getTableById(id);
    if (!table) {
      return res.status(404).json({ message: "Bàn không tồn tại" });
    }

    await Table.deleteTable(id);

    sendResponse(res, 200, { id }, "Xóa bàn thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

// Get all areas
const getAllAreas = async (req, res) => {
  try {
    const areas = await Table.getAllAreas();
    sendResponse(res, 200, areas, "Lấy danh sách khu vực thành công");
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server" });
  }
};

module.exports = {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
  getAllAreas,
};
