const {
  getProductsForComparison,
  getProductComparisonVariants,
} = require("../models/comparisonModel");


/*
|--------------------------------------------------------------------------
| COMPARE PRODUCTS
|--------------------------------------------------------------------------
|
| GET /api/public/products/compare?ids=2,3,5
|
*/

const compareProducts = async (req, res) => {
  try {

    const idsQuery = req.query.ids;


    // --------------------------------------------------
    // CHECK IDS
    // --------------------------------------------------

    if (!idsQuery) {
      return res.status(400).json({
        success: false,
        message: "Product ids are required",
      });
    }


    // --------------------------------------------------
    // CONVERT IDS
    // --------------------------------------------------

    const productIds = idsQuery
      .split(",")
      .map((id) => id.trim());


    // --------------------------------------------------
    // MUST HAVE 2 TO 4 PRODUCTS
    // --------------------------------------------------

    if (
      productIds.length < 2 ||
      productIds.length > 4
    ) {
      return res.status(400).json({
        success: false,
        message: "You can compare between 2 and 4 products",
      });
    }


    // --------------------------------------------------
    // VALIDATE IDS
    // --------------------------------------------------

    const numericIds = productIds.map((id) => Number(id));

    const hasInvalidId = numericIds.some(
      (id) =>
        !Number.isInteger(id) ||
        id <= 0
    );


    if (hasInvalidId) {
      return res.status(400).json({
        success: false,
        message: "Product ids must be valid positive integers",
      });
    }


    // --------------------------------------------------
    // REMOVE DUPLICATES
    // --------------------------------------------------

    const uniqueIds = [...new Set(numericIds)];


    if (uniqueIds.length !== numericIds.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate product ids are not allowed",
      });
    }


    // --------------------------------------------------
    // GET PRODUCTS
    // --------------------------------------------------

    const products =
      await getProductsForComparison(uniqueIds);


    // --------------------------------------------------
    // CHECK WHETHER ALL PRODUCTS EXIST
    // --------------------------------------------------

    if (products.length !== uniqueIds.length) {

      const foundIds = products.map(
        (product) => product.id
      );

      const missingIds = uniqueIds.filter(
        (id) => !foundIds.includes(id)
      );

      return res.status(404).json({
        success: false,
        message: "One or more products are not available for comparison",
        missing_product_ids: missingIds,
      });
    }


    // --------------------------------------------------
    // GET VARIANTS
    // --------------------------------------------------

    const variants =
      await getProductComparisonVariants(uniqueIds);


    // --------------------------------------------------
    // ATTACH VARIANTS TO PRODUCTS
    // --------------------------------------------------

    const comparisonProducts = products.map(
      (product) => {

        const productVariants = variants.filter(
          (variant) =>
            variant.product_id === product.id
        );


        return {
          ...product,
          variants: productVariants,
        };
      }
    );


    // --------------------------------------------------
    // KEEP SAME ORDER AS REQUEST
    // --------------------------------------------------

    comparisonProducts.sort(
      (a, b) =>
        uniqueIds.indexOf(a.id) -
        uniqueIds.indexOf(b.id)
    );


    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Products compared successfully",

      data: {
        products: comparisonProducts,
        comparison_count: comparisonProducts.length,
      },
    });

  } catch (error) {

    console.error(
      "Compare products error:",
      error
    );


    return res.status(500).json({
      success: false,
      message: "Failed to compare products",
    });
  }
};


module.exports = {
  compareProducts,
};