const express = require("express");

const {
  getProductReviews
} = require("../controllers/publicReviewController");

const router = express.Router();


// Public product reviews
router.get(
  "/:productId/reviews",
  getProductReviews
);


module.exports = router;