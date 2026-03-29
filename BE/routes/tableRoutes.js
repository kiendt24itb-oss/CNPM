const express = require("express");
const router = express.Router();
const tableController = require("../controllers/tableController");
const { verifyToken, checkAdmin } = require("../middleware/auth");

// Public routes
router.get("/areas", tableController.getAllAreas);

// Protected routes
router.use(verifyToken);

// Get all tables
router.get("/", tableController.getAllTables);

// Get table by ID
router.get("/:id", tableController.getTableById);

// Admin only routes
router.use(checkAdmin);

// Create table
router.post("/", tableController.createTable);

// Update table
router.put("/:id", tableController.updateTable);

// Delete table
router.delete("/:id", tableController.deleteTable);

module.exports = router;
