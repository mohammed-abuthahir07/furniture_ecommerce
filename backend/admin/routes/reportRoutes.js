const express = require("express");

const {
  salesReport,
  ordersReport,
  productsReport,
  customersReport,
  inventoryReport,
  paymentsReport,
  categoriesReport,
} = require("../controllers/reportController");

const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");

const router = express.Router();


// ============================================================
// SALES REPORT
// ============================================================

router.get(
  "/sales",
  adminAuthMiddleware,
  salesReport
);


// ============================================================
// ORDERS REPORT
// ============================================================

router.get(
  "/orders",
  adminAuthMiddleware,
  ordersReport
);


// ============================================================
// PRODUCTS REPORT
// ============================================================

router.get(
  "/products",
  adminAuthMiddleware,
  productsReport
);


// ============================================================
// CUSTOMERS REPORT
// ============================================================

router.get(
  "/customers",
  adminAuthMiddleware,
  customersReport
);


// ============================================================
// INVENTORY REPORT
// ============================================================

router.get(
  "/inventory",
  adminAuthMiddleware,
  inventoryReport
);


// ============================================================
// PAYMENTS REPORT
// ============================================================

router.get(
  "/payments",
  adminAuthMiddleware,
  paymentsReport
);


// ============================================================
// CATEGORIES REPORT
// ============================================================

router.get(
  "/categories",
  adminAuthMiddleware,
  categoriesReport
);


module.exports = router;