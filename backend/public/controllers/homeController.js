const {
  getHomeCategories,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellingProducts,
  getTopRatedProducts,
  getHomeOffers,
} = require("../models/homeModel");


/*
|--------------------------------------------------------------------------
| PUBLIC HOME
|--------------------------------------------------------------------------
*/

const getHome = async (req, res) => {
  try {

    const [
      categories,
      featuredProducts,
      newArrivals,
      bestSellingProducts,
      topRatedProducts,
      offers,
    ] = await Promise.all([
      getHomeCategories(),
      getFeaturedProducts(),
      getNewArrivals(),
      getBestSellingProducts(),
      getTopRatedProducts(),
      getHomeOffers(),
    ]);


    return res.status(200).json({
      success: true,
      message: "Home data fetched successfully",

      data: {
        categories,
        featured_products: featuredProducts,
        new_arrivals: newArrivals,
        best_selling_products: bestSellingProducts,
        top_rated_products: topRatedProducts,
        offers,
      },
    });

  } catch (error) {

    console.error(
      "Get public home error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Failed to fetch home data",
    });
  }
};


module.exports = {
  getHome,
};