const express = require("express");

const {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require("../controllers/orderController");

const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");

const router = express.Router();

// =====================================================
// GET ALL ORDERS
// =====================================================
router.get(
  "/",
  adminAuthMiddleware,
  getAllOrders
);

// =====================================================
// GET SINGLE ORDER
// =====================================================
router.get(
  "/:id",
  adminAuthMiddleware,
  getOrderById
);

// =====================================================
// UPDATE ORDER STATUS
// =====================================================
router.patch(
  "/:id/status",
  adminAuthMiddleware,
  updateOrderStatus
);

module.exports = router;