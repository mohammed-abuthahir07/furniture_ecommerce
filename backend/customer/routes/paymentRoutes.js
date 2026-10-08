const express = require("express");
const customerAuthMiddleware = require("../../middleware/customerAuthMiddleware");
const { createRazorpayOrder } = require("../controllers/paymentController");

const router = express.Router();

router.post(
  "/razorpay-order",
  customerAuthMiddleware,
  createRazorpayOrder
);

module.exports = router;
