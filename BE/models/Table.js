const pool = require("../config/database");

// Get all tables
const getAllTables = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT t.table_id, t.table_name, t.area_id, t.capacity, t.note, t.status,
             a.area_name
      FROM cafe_tables t
      LEFT JOIN areas a ON t.area_id = a.area_id
      ORDER BY t.table_id
    `);
    return rows.map(row => ({
      id: row.table_id,
      name: row.table_name,
      areaId: row.area_id,
      areaName: row.area_name,
      capacity: row.capacity,
      note: row.note,
      status: row.status
    }));
  } finally {
    connection.release();
  }
};

// Get table by ID
const getTableById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(`
      SELECT t.table_id, t.table_name, t.area_id, t.capacity, t.note, t.status,
             a.area_name
      FROM cafe_tables t
      LEFT JOIN areas a ON t.area_id = a.area_id
      WHERE t.table_id = ?
    `, [id]);
    if (rows.length === 0) return null;
    const row = rows[0];
    return {
      id: row.table_id,
      name: row.table_name,
      areaId: row.area_id,
      areaName: row.area_name,
      capacity: row.capacity,
      note: row.note,
      status: row.status
    };
  } finally {
    connection.release();
  }
};

// Create table
const createTable = async (name, areaId, capacity, note) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "INSERT INTO cafe_tables (table_name, area_id, capacity, note) VALUES (?, ?, ?, ?)",
      [name, areaId, capacity, note]
    );
    return result.insertId;
  } finally {
    connection.release();
  }
};

// Update table
const updateTable = async (id, name, areaId, capacity, note, status) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "UPDATE cafe_tables SET table_name = ?, area_id = ?, capacity = ?, note = ?, status = ? WHERE table_id = ?",
      [name, areaId, capacity, note, status, id]
    );
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
};

// Delete table
const deleteTable = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "DELETE FROM cafe_tables WHERE table_id = ?",
      [id]
    );
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
};

// Get all areas
const getAllAreas = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query("SELECT * FROM areas ORDER BY area_name");
    return rows.map(row => ({
      id: row.area_id,
      name: row.area_name
    }));
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllTables,
  getTableById,
  createTable,
  updateTable,
  deleteTable,
  getAllAreas
};