const {
  getReviewSummary,
  getPublicReviews,
  findActiveProduct
} = require("../models/publicReviewModel");


// ==========================================
// GET PUBLIC PRODUCT REVIEWS
// GET /api/public/products/:productId/reviews
// ==========================================

const getProductReviews = async (req, res) => {
  try {

    const productId = Number(
      req.params.productId
    );


    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid product ID"
      });
    }


    // Check product
    const product =
      await findActiveProduct(productId);


    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }


    if (product.status !== "ACTIVE") {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }


    // Get summary
    const summary =
      await getReviewSummary(productId);


    // Get reviews
    const reviews =
      await getPublicReviews(productId);


    return res.status(200).json({
      success: true,

      product_id: productId,

      product_name: product.name,

      average_rating:
        Number(summary.average_rating),

      total_reviews:
        Number(summary.total_reviews),

      rating_summary: {
        5: Number(summary.five_star),
        4: Number(summary.four_star),
        3: Number(summary.three_star),
        2: Number(summary.two_star),
        1: Number(summary.one_star)
      },

      reviews
    });

  } catch (error) {

    console.error(
      "Get public product reviews error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch product reviews"
    });
  }
};


module.exports = {
  getProductReviews
};