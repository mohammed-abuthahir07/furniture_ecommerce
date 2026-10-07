const express = require("express");

const {
  getCategories,
  getCategoryById,
} = require("../controllers/categoryController");

const router = express.Router();

// Get all active categories
router.get("/", getCategories);

// Get one active category
router.get("/:id", getCategoryById);

module.exports = router;