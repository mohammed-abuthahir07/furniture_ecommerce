const express = require("express");

const {
  getInventory,
  getInventorySummaryController,
  getLowStock,
  getOutOfStock,
  getProductInventory,
  updateStock,
} = require("../controllers/inventoryController");

const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");

const router = express.Router();


// ============================================================
// GET ALL INVENTORY
// ============================================================

router.get(
  "/",
  adminAuthMiddleware,
  getInventory
);


// ============================================================
// GET INVENTORY SUMMARY
// ============================================================

router.get(
  "/summary",
  adminAuthMiddleware,
  getInventorySummaryController
);


// ============================================================
// GET LOW STOCK
// ============================================================

router.get(
  "/low-stock",
  adminAuthMiddleware,
  getLowStock
);


// ============================================================
// GET OUT OF STOCK
// ============================================================

router.get(
  "/out-of-stock",
  adminAuthMiddleware,
  getOutOfStock
);


// ============================================================
// GET INVENTORY BY PRODUCT
// ============================================================

router.get(
  "/product/:productId",
  adminAuthMiddleware,
  getProductInventory
);


// ============================================================
// UPDATE VARIANT STOCK
// ============================================================

router.patch(
  "/variant/:variantId/stock",
  adminAuthMiddleware,
  updateStock
);


module.exports = router;