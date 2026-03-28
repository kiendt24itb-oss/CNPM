const pool = require("../config/database");

// Map row columns from different schema versions
const normalizeUserRow = (row) => {
  if (!row) return null;
  return {
    id: row.id || row.user_id,
    email: row.email,
    password: row.password,
    username: row.username,
    fullName: row.fullName || row.full_name,
    role: row.role,
    google_id: row.google_id,
    provider: row.provider,
    createdAt: row.createdAt || row.created_at,
  };
};

// Get all users
const getAllUsers = async () => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT user_id AS id, email, password, username, fullName, phone, address, role, google_id, provider, created_at AS createdAt FROM users",
    );
    return rows.map(normalizeUserRow);
  } finally {
    connection.release();
  }
};

// Get user by ID
const getUserById = async (id) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT user_id AS id, email, password, username, fullName, phone, address, role, google_id, provider, created_at AS createdAt FROM users WHERE user_id = ?",
      [id],
    );
    return normalizeUserRow(rows[0]);
  } finally {
    connection.release();
  }
};

// Get user by email
const getUserByEmail = async (email) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT user_id AS id, email, password, username, fullName, role, google_id, provider, created_at AS createdAt FROM users WHERE email = ?",
      [email],
    );
    return normalizeUserRow(rows[0]);
  } finally {
    connection.release();
  }
};

// Get user by Google ID
const getUserByGoogleId = async (googleId) => {
  const connection = await pool.getConnection();
  try {
    const [rows] = await connection.query(
      "SELECT user_id AS id, email, password, username, fullName, phone, address, role, google_id, provider, created_at AS createdAt FROM users WHERE google_id = ?",
      [googleId],
    );
    return normalizeUserRow(rows[0]);
  } finally {
    connection.release();
  }
};

// Create user
const createUser = async (
  email,
  password,
  username,
  fullName,
  role = "STAFF",
  googleId = null,
  provider = "LOCAL",
) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "INSERT INTO users (email, password, username, fullName, role, google_id, provider) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [email, password, username, fullName, role, googleId, provider],
    );
    return result.insertId;
  } finally {
    connection.release();
  }
};

// Update user
const updateUser = async (id, fullName, phone, address) => {
  const connection = await pool.getConnection();
  try {
    const [result] = await connection.query(
      "UPDATE users SET fullName = ?, phone = ?, address = ? WHERE user_id = ?",
      [fullName, phone, address, id],
    );
    return result.affectedRows > 0;
  } finally {
    connection.release();
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByGoogleId,
  createUser,
  updateUser,
};
