const express = require("express");

const {
  getCustomers,
  getCustomer,
  changeCustomerStatus,
} = require("../controllers/customerController");

const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");

const router = express.Router();


// ============================================================
// GET ALL CUSTOMERS
// ============================================================

router.get(
  "/",
  adminAuthMiddleware,
  getCustomers
);


// ============================================================
// GET COMPLETE CUSTOMER DETAILS
// ============================================================

router.get(
  "/:id",
  adminAuthMiddleware,
  getCustomer
);


// ============================================================
// ACTIVATE / DEACTIVATE CUSTOMER
// ============================================================

router.patch(
  "/:id/status",
  adminAuthMiddleware,
  changeCustomerStatus
);


module.exports = router;