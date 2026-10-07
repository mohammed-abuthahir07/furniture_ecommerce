const express = require("express");

const {
  addReview,
  getMyReviews,
  editReview,
  removeReview
} = require("../controllers/reviewController");

const customerAuthMiddleware =
  require("../../middleware/customerAuthMiddleware");

const router = express.Router();


// Add review
router.post(
  "/",
  customerAuthMiddleware,
  addReview
);


// Get logged-in customer's reviews
router.get(
  "/my",
  customerAuthMiddleware,
  getMyReviews
);


// Update own review
router.put(
  "/:id",
  customerAuthMiddleware,
  editReview
);


// Delete own review
router.delete(
  "/:id",
  customerAuthMiddleware,
  removeReview
);


module.exports = router;