const {
  getActiveProducts,
  getActiveProductById,
  getActiveProductImages,
  getActiveProductVariants,
  getProductRatingSummary,
  getProductReviews,
} = require("../models/productModel");

// ======================================================
// GET ALL ACTIVE PRODUCTS
// ======================================================

const getProducts = async (req, res) => {
  try {
    const products = await getActiveProducts();

    return res.status(200).json({
      success: true,
      message: "Active products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.error("Get public products error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

// ======================================================
// GET ONE ACTIVE PRODUCT
// ======================================================

const getProductById = async (req, res) => {
  try {
    const productId = Number(req.params.id);

    // Validate product ID
    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID",
      });
    }

    // Get product
    const product = await getActiveProductById(productId);

    // Product not found or inactive
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Get gallery images
    const images = await getActiveProductImages(productId);

    // Get active variants
    const variants = await getActiveProductVariants(productId);

    // Get rating summary
    const rating = await getProductRatingSummary(productId);

    // Get approved reviews/comments
    const reviews = await getProductReviews(productId);

    return res.status(200).json({
      success: true,
      message: "Product fetched successfully",

      data: {
        ...product,
        images,
        variants,
        rating,
        reviews,
      },
    });
  } catch (error) {
    console.error("Get public product by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product",
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
};