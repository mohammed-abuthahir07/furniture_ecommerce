const express = require("express");

const {
  getDashboardSummary,
  getOrderStatusSummary,
  getRevenueSummary,
  getTodaySummary,
  getLowStockVariants,
  getOutOfStockVariants,
  getRecentOrders,
  getRecentProducts,
  getBestSellingProducts,
} = require("../controllers/dashboardController");

const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");

const router = express.Router();


// =====================================================
// DASHBOARD SUMMARY
// =====================================================
router.get(
  "/summary",
  adminAuthMiddleware,
  getDashboardSummary
);


// =====================================================
// ORDER STATUS
// =====================================================
router.get(
  "/order-status",
  adminAuthMiddleware,
  getOrderStatusSummary
);


// =====================================================
// REVENUE
// =====================================================
router.get(
  "/revenue",
  adminAuthMiddleware,
  getRevenueSummary
);


// =====================================================
// TODAY
// =====================================================
router.get(
  "/today",
  adminAuthMiddleware,
  getTodaySummary
);


// =====================================================
// LOW STOCK
// =====================================================
router.get(
  "/low-stock",
  adminAuthMiddleware,
  getLowStockVariants
);


// =====================================================
// OUT OF STOCK
// =====================================================
router.get(
  "/out-of-stock",
  adminAuthMiddleware,
  getOutOfStockVariants
);


// =====================================================
// RECENT ORDERS
// =====================================================
router.get(
  "/recent-orders",
  adminAuthMiddleware,
  getRecentOrders
);


// =====================================================
// RECENT PRODUCTS
// =====================================================
router.get(
  "/recent-products",
  adminAuthMiddleware,
  getRecentProducts
);


// =====================================================
// BEST SELLING PRODUCTS
// =====================================================
router.get(
  "/best-selling-products",
  adminAuthMiddleware,
  getBestSellingProducts
);


module.exports = router;