const express = require("express");

const {
  createCustomerController,
  getCustomers,
  getCustomer,
  editCustomer,
  changeCustomerStatus,
  removeCustomer,
  getCustomerOrderHistory,
} = require("../controllers/customerController");

const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");

const router = express.Router();


// CREATE CUSTOMER
router.post(
  "/",
  adminAuthMiddleware,
  createCustomerController
);


// GET ALL CUSTOMERS
router.get(
  "/",
  adminAuthMiddleware,
  getCustomers
);


// GET CUSTOMER ORDER HISTORY
router.get(
  "/:id/orders",
  adminAuthMiddleware,
  getCustomerOrderHistory
);


// GET CUSTOMER BY ID
router.get(
  "/:id",
  adminAuthMiddleware,
  getCustomer
);


// UPDATE CUSTOMER
router.put(
  "/:id",
  adminAuthMiddleware,
  editCustomer
);


// UPDATE CUSTOMER STATUS
router.patch(
  "/:id/status",
  adminAuthMiddleware,
  changeCustomerStatus
);


// DELETE CUSTOMER
router.delete(
  "/:id",
  adminAuthMiddleware,
  removeCustomer
);


module.exports = router;