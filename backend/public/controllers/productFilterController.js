const {
  getFilteredProducts,
} = require("../models/productFilterModel");

// ======================================================
// SEARCH + FILTER + PAGINATION
// ======================================================

const searchAndFilterProducts = async (req, res) => {
  try {
    const {
      search,
      category_id,
      material,
      wood_type,
      min_price,
      max_price,
      sort,
    } = req.query;

    // ==================================================
    // PAGE
    // ==================================================

    const page = Number(req.query.page) || 1;

    if (!Number.isInteger(page) || page < 1) {
      return res.status(400).json({
        success: false,
        message: "Page must be a positive integer",
      });
    }

    // ==================================================
    // LIMIT
    // ==================================================

    const limit = Number(req.query.limit) || 10;

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 100",
      });
    }

    // ==================================================
    // CATEGORY
    // ==================================================

    let categoryId;

    if (category_id !== undefined) {
      categoryId = Number(category_id);

      if (
        !Number.isInteger(categoryId) ||
        categoryId <= 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid category_id",
        });
      }
    }

    // ==================================================
    // MIN PRICE
    // ==================================================

    let minPrice;

    if (min_price !== undefined) {
      minPrice = Number(min_price);

      if (
        !Number.isFinite(minPrice) ||
        minPrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid min_price",
        });
      }
    }

    // ==================================================
    // MAX PRICE
    // ==================================================

    let maxPrice;

    if (max_price !== undefined) {
      maxPrice = Number(max_price);

      if (
        !Number.isFinite(maxPrice) ||
        maxPrice < 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid max_price",
        });
      }
    }

    // ==================================================
    // PRICE RANGE
    // ==================================================

    if (
      minPrice !== undefined &&
      maxPrice !== undefined &&
      minPrice > maxPrice
    ) {
      return res.status(400).json({
        success: false,
        message:
          "min_price cannot be greater than max_price",
      });
    }

    // ==================================================
    // SEARCH
    // ==================================================

    const cleanSearch =
      typeof search === "string"
        ? search.trim()
        : undefined;

    // ==================================================
    // MATERIAL
    // ==================================================

    const cleanMaterial =
      typeof material === "string"
        ? material.trim()
        : undefined;

    // ==================================================
    // WOOD TYPE
    // ==================================================

    const cleanWoodType =
      typeof wood_type === "string"
        ? wood_type.trim()
        : undefined;

    // ==================================================
    // GET PRODUCTS
    // ==================================================

    const {
      products,
      totalProducts,
    } = await getFilteredProducts({
      search: cleanSearch,
      categoryId,
      material: cleanMaterial,
      woodType: cleanWoodType,
      minPrice,
      maxPrice,
      sort,
      page,
      limit,
    });

    // ==================================================
    // TOTAL PAGES
    // ==================================================

    const totalPages =
      totalProducts === 0
        ? 0
        : Math.ceil(totalProducts / limit);

    return res.status(200).json({
      success: true,
      message: "Products filtered successfully",

      data: products,

      pagination: {
        current_page: page,
        limit,
        total_products: totalProducts,
        total_pages: totalPages,
        has_next_page: page < totalPages,
        has_previous_page: page > 1,
      },
    });
  } catch (error) {
    console.error(
      "Public product search/filter error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to search/filter products",
    });
  }
};

module.exports = {
  searchAndFilterProducts,
};