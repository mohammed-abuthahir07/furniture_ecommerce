const {
  findProductById,
  findReviewByCustomerAndProduct,
  findReviewById,
  createReview,
  getCustomerReviews,
  updateReview,
  deleteReview
} = require("../models/reviewModel");


// ==========================================
// CREATE REVIEW
// POST /api/customer/reviews
// ==========================================

const addReview = async (req, res) => {
  try {
    const customerId = req.customer.id;

    const {
      product_id,
      rating,
      comment
    } = req.body;


    // Validate product ID
    const productId = Number(product_id);

    if (!Number.isInteger(productId) || productId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Valid product ID is required"
      });
    }


    // Validate rating
    const reviewRating = Number(rating);

    if (
      !Number.isInteger(reviewRating) ||
      reviewRating < 1 ||
      reviewRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a whole number between 1 and 5"
      });
    }


    // Validate comment
    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment is required"
      });
    }

    const trimmedComment = comment.trim();


    if (trimmedComment.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Comment must contain at least 3 characters"
      });
    }


    if (trimmedComment.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot exceed 2000 characters"
      });
    }


    // Check product
    const product = await findProductById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }


    // Only active products can receive new reviews
    if (product.status !== "ACTIVE") {
      return res.status(400).json({
        success: false,
        message: "Reviews cannot be added to an inactive product"
      });
    }


    // Check duplicate review
    const existingReview =
      await findReviewByCustomerAndProduct(
        customerId,
        productId
      );

    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product"
      });
    }


    // Create review
    const reviewId = await createReview({
      customerId,
      productId,
      rating: reviewRating,
      comment: trimmedComment
    });


    return res.status(201).json({
      success: true,
      message: "Review added successfully",
      review_id: reviewId
    });

  } catch (error) {

    console.error("Add review error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to add review"
    });
  }
};


// ==========================================
// GET MY REVIEWS
// GET /api/customer/reviews/my
// ==========================================

const getMyReviews = async (req, res) => {
  try {

    const customerId = req.customer.id;

    const reviews =
      await getCustomerReviews(customerId);


    return res.status(200).json({
      success: true,
      message: "Your reviews fetched successfully",
      reviews
    });

  } catch (error) {

    console.error("Get my reviews error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch your reviews"
    });
  }
};


// ==========================================
// UPDATE REVIEW
// PUT /api/customer/reviews/:id
// ==========================================

const editReview = async (req, res) => {
  try {

    const customerId = req.customer.id;

    const reviewId = Number(req.params.id);

    const {
      rating,
      comment
    } = req.body;


    if (!Number.isInteger(reviewId) || reviewId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID"
      });
    }


    // Validate rating
    const reviewRating = Number(rating);

    if (
      !Number.isInteger(reviewRating) ||
      reviewRating < 1 ||
      reviewRating > 5
    ) {
      return res.status(400).json({
        success: false,
        message: "Rating must be a whole number between 1 and 5"
      });
    }


    // Validate comment
    if (!comment || !comment.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment is required"
      });
    }

    const trimmedComment = comment.trim();


    if (trimmedComment.length < 3) {
      return res.status(400).json({
        success: false,
        message: "Comment must contain at least 3 characters"
      });
    }


    if (trimmedComment.length > 2000) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot exceed 2000 characters"
      });
    }


    // Find review
    const review = await findReviewById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }


    // Ownership check
    if (review.customer_id !== customerId) {
      return res.status(403).json({
        success: false,
        message: "You can only edit your own review"
      });
    }


    await updateReview({
      reviewId,
      rating: reviewRating,
      comment: trimmedComment
    });


    const updatedReview =
      await findReviewById(reviewId);


    return res.status(200).json({
      success: true,
      message: "Review updated successfully",
      review: updatedReview
    });

  } catch (error) {

    console.error("Update review error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update review"
    });
  }
};


// ==========================================
// DELETE REVIEW
// DELETE /api/customer/reviews/:id
// ==========================================

const removeReview = async (req, res) => {
  try {

    const customerId = req.customer.id;

    const reviewId = Number(req.params.id);


    if (!Number.isInteger(reviewId) || reviewId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid review ID"
      });
    }


    // Find review
    const review = await findReviewById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: "Review not found"
      });
    }


    // Ownership check
    if (review.customer_id !== customerId) {
      return res.status(403).json({
        success: false,
        message: "You can only delete your own review"
      });
    }


    await deleteReview(reviewId);


    return res.status(200).json({
      success: true,
      message: "Review deleted successfully"
    });

  } catch (error) {

    console.error("Delete review error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete review"
    });
  }
};


module.exports = {
  addReview,
  getMyReviews,
  editReview,
  removeReview
};