const express = require("express");

const {
  createVariant,
  getVariantsByProductId,
  getVariantById,
  updateVariant,
  updateVariantStock,
  updateVariantStatus,
  deleteVariant,
} = require("../controllers/productVariantController");

const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");

const router = express.Router();

// CREATE VARIANT
router.post(
  "/",
  adminAuthMiddleware,
  createVariant
);

// GET ALL VARIANTS FOR A PRODUCT
router.get(
  "/product/:productId",
  adminAuthMiddleware,
  getVariantsByProductId
);

// GET SINGLE VARIANT
router.get(
  "/:id",
  adminAuthMiddleware,
  getVariantById
);

// UPDATE VARIANT
router.put(
  "/:id",
  adminAuthMiddleware,
  updateVariant
);

// UPDATE STOCK ONLY
router.patch(
  "/:id/stock",
  adminAuthMiddleware,
  updateVariantStock
);

// UPDATE STATUS
router.patch(
  "/:id/status",
  adminAuthMiddleware,
  updateVariantStatus
);

// DELETE VARIANT
router.delete(
  "/:id",
  adminAuthMiddleware,
  deleteVariant
);

module.exports = router;