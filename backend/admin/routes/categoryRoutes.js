
const express = require("express");

const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
} = require("../controllers/categoryController");

const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");
const categoryUploadMiddleware = require("../../middleware/categoryUploadMiddleware");

const router = express.Router();

// CREATE CATEGORY
router.post(
  "/",
  adminAuthMiddleware,
  categoryUploadMiddleware.single("image"),
  createCategory
);

// GET ALL CATEGORIES
router.get(
  "/",
  adminAuthMiddleware,
  getAllCategories
);

// GET CATEGORY BY ID
router.get(
  "/:id",
  adminAuthMiddleware,
  getCategoryById
);

// UPDATE CATEGORY
router.put(
  "/:id",
  adminAuthMiddleware,
  categoryUploadMiddleware.single("image"),
  updateCategory
);

// ACTIVATE / DEACTIVATE CATEGORY
router.patch(
  "/:id/status",
  adminAuthMiddleware,
  updateCategoryStatus
);

// DELETE CATEGORY
router.delete(
  "/:id",
  adminAuthMiddleware,
  deleteCategory
);

module.exports = router;

