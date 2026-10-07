const {
  getRecommendedProducts,
  getActiveProductForRecommendation,
} = require("../models/recommendationModel");


// GET RECOMMENDED PRODUCTS
const getRecommendations = async (req, res) => {
  try {
    const productId = Number(req.query.product_id);

    if (
      !Number.isInteger(productId) ||
      productId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid product_id is required",
      });
    }


    // CHECK PRODUCT
    const product =
      await getActiveProductForRecommendation(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }


    // LIMIT
    const limit = Number(req.query.limit) || 8;

    if (
      !Number.isInteger(limit) ||
      limit < 1 ||
      limit > 20
    ) {
      return res.status(400).json({
        success: false,
        message: "Limit must be between 1 and 20",
      });
    }


    // GET RECOMMENDATIONS
    const recommendations =
      await getRecommendedProducts(
        productId,
        limit
      );


    return res.status(200).json({
      success: true,
      message: "Recommended products fetched successfully",
      data: recommendations,
    });

  } catch (error) {

    console.error(
      "Get product recommendations error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recommended products",
    });
  }
};


module.exports = {
  getRecommendations,
};