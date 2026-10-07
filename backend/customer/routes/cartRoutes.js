
const express = require("express");

const {
  addToCart,
  getCart,
  updateCartQuantity,
  removeFromCart,
  clearCart
} = require("../controllers/cartController");

const customerAuthMiddleware =
  require("../../middleware/customerAuthMiddleware");

const router = express.Router();


// Add to cart
router.post(
  "/",
  customerAuthMiddleware,
  addToCart
);


// Get my cart
router.get(
  "/",
  customerAuthMiddleware,
  getCart
);


// Update quantity
router.patch(
  "/:id",
  customerAuthMiddleware,
  updateCartQuantity
);


// Remove one item
router.delete(
  "/:id",
  customerAuthMiddleware,
  removeFromCart
);


// Clear entire cart
router.delete(
  "/",
  customerAuthMiddleware,
  clearCart
);


module.exports = router;