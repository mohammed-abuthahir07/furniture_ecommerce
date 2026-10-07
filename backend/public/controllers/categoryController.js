const {
  getActiveCategories,
  getActiveCategoryById,
} = require("../models/categoryModel");

// Get all active categories
const getCategories = async (req, res) => {
  try {
    const categories = await getActiveCategories();

    return res.status(200).json({
      success: true,
      message: "Active categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    console.error("Get public categories error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
    });
  }
};

// Get one active category
const getCategoryById = async (req, res) => {
  try {
    const categoryId = Number(req.params.id);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid category ID",
      });
    }

    const category = await getActiveCategoryById(categoryId);

    if (!category) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: category,
    });
  } catch (error) {
    console.error("Get public category error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch category",
    });
  }
};

module.exports = {
  getCategories,
  getCategoryById,
};