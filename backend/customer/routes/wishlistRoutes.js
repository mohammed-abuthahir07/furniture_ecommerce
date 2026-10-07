const express = require("express");

const {
  addProductToWishlist,
  getWishlist,
  checkWishlist,
  removeFromWishlist
} = require("../controllers/wishlistController");

const customerAuthMiddleware =
  require("../../middleware/customerAuthMiddleware");

const router = express.Router();

router.post(
  "/",
  customerAuthMiddleware,
  addProductToWishlist
);

router.get(
  "/",
  customerAuthMiddleware,
  getWishlist
);

router.get(
  "/check/:productId",
  customerAuthMiddleware,
  checkWishlist
);

router.delete(
  "/:productId",
  customerAuthMiddleware,
  removeFromWishlist
);

module.exports = router;