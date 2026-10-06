const dashboardModel = require("../models/dashboardModel");

// =====================================================
// DASHBOARD SUMMARY
// =====================================================
const getDashboardSummary = async (req, res) => {
  try {
    const summary = await dashboardModel.getDashboardSummary();

    return res.status(200).json({
      success: true,
      message: "Dashboard summary fetched successfully",
      summary,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard summary",
    });
  }
};


// =====================================================
// ORDER STATUS
// =====================================================
const getOrderStatusSummary = async (req, res) => {
  try {
    const orderStatus =
      await dashboardModel.getOrderStatusSummary();

    return res.status(200).json({
      success: true,
      message: "Order status summary fetched successfully",
      order_status: orderStatus,
    });
  } catch (error) {
    console.error("Order status dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch order status summary",
    });
  }
};


// =====================================================
// REVENUE
// =====================================================
const getRevenueSummary = async (req, res) => {
  try {
    const revenue =
      await dashboardModel.getRevenueSummary();

    return res.status(200).json({
      success: true,
      message: "Revenue summary fetched successfully",
      revenue,
    });
  } catch (error) {
    console.error("Revenue dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch revenue summary",
    });
  }
};


// =====================================================
// TODAY
// =====================================================
const getTodaySummary = async (req, res) => {
  try {
    const today =
      await dashboardModel.getTodaySummary();

    return res.status(200).json({
      success: true,
      message: "Today summary fetched successfully",
      today,
    });
  } catch (error) {
    console.error("Today dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch today summary",
    });
  }
};


// =====================================================
// LOW STOCK
// =====================================================
const getLowStockVariants = async (req, res) => {
  try {
    const variants =
      await dashboardModel.getLowStockVariants();

    return res.status(200).json({
      success: true,
      message: "Low stock variants fetched successfully",
      total: variants.length,
      variants,
    });
  } catch (error) {
    console.error("Low stock dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch low stock variants",
    });
  }
};


// =====================================================
// OUT OF STOCK
// =====================================================
const getOutOfStockVariants = async (req, res) => {
  try {
    const variants =
      await dashboardModel.getOutOfStockVariants();

    return res.status(200).json({
      success: true,
      message: "Out of stock variants fetched successfully",
      total: variants.length,
      variants,
    });
  } catch (error) {
    console.error("Out of stock dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch out of stock variants",
    });
  }
};


// =====================================================
// RECENT ORDERS
// =====================================================
const getRecentOrders = async (req, res) => {
  try {
    const orders =
      await dashboardModel.getRecentOrders();

    return res.status(200).json({
      success: true,
      message: "Recent orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Recent orders dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent orders",
    });
  }
};


// =====================================================
// RECENT PRODUCTS
// =====================================================
const getRecentProducts = async (req, res) => {
  try {
    const products =
      await dashboardModel.getRecentProducts();

    return res.status(200).json({
      success: true,
      message: "Recent products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Recent products dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch recent products",
    });
  }
};


// =====================================================
// BEST SELLING PRODUCTS
// =====================================================
const getBestSellingProducts = async (req, res) => {
  try {
    const products =
      await dashboardModel.getBestSellingProducts();

    return res.status(200).json({
      success: true,
      message: "Best selling products fetched successfully",
      products,
    });
  } catch (error) {
    console.error("Best selling dashboard error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch best selling products",
    });
  }
};


module.exports = {
  getDashboardSummary,
  getOrderStatusSummary,
  getRevenueSummary,
  getTodaySummary,
  getLowStockVariants,
  getOutOfStockVariants,
  getRecentOrders,
  getRecentProducts,
  getBestSellingProducts,
};