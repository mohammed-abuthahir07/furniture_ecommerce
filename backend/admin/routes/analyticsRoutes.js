const express = require("express");

const {
  analyticsSummary,
  salesAnalytics,
  revenueAnalytics,
  ordersAnalytics,
  productsAnalytics,
  bestSellingProductsAnalytics,
  categoriesAnalytics,
  customersAnalytics,
  paymentsAnalytics,
  inventoryAnalytics,
  bestSellingCategoriesAnalytics,
} = require("../controllers/analyticsController");

const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");

const router = express.Router();


// ============================================================
// ANALYTICS SUMMARY
// ============================================================

router.get(
  "/summary",
  adminAuthMiddleware,
  analyticsSummary
);


// ============================================================
// SALES ANALYTICS
// ============================================================

router.get(
  "/sales",
  adminAuthMiddleware,
  salesAnalytics
);


// ============================================================
// REVENUE ANALYTICS
// ============================================================

router.get(
  "/revenue",
  adminAuthMiddleware,
  revenueAnalytics
);


// ============================================================
// ORDER ANALYTICS
// ============================================================

router.get(
  "/orders",
  adminAuthMiddleware,
  ordersAnalytics
);


// ============================================================
// PRODUCT ANALYTICS
// ============================================================

router.get(
  "/products",
  adminAuthMiddleware,
  productsAnalytics
);


// ============================================================
// BEST SELLING PRODUCTS
// ============================================================

router.get(
  "/best-selling-products",
  adminAuthMiddleware,
  bestSellingProductsAnalytics
);


// ============================================================
// CATEGORY ANALYTICS
// ============================================================

router.get(
  "/categories",
  adminAuthMiddleware,
  categoriesAnalytics
);


// ============================================================
// CUSTOMER ANALYTICS
// ============================================================

router.get(
  "/customers",
  adminAuthMiddleware,
  customersAnalytics
);


// ============================================================
// PAYMENT ANALYTICS
// ============================================================

router.get(
  "/payments",
  adminAuthMiddleware,
  paymentsAnalytics
);


// ============================================================
// INVENTORY ANALYTICS
// ============================================================

router.get(
  "/inventory",
  adminAuthMiddleware,
  inventoryAnalytics
);


// ============================================================
// BEST SELLING CATEGORIES
// ============================================================

router.get(
  "/best-selling-categories",
  adminAuthMiddleware,
  bestSellingCategoriesAnalytics
);


module.exports = router;