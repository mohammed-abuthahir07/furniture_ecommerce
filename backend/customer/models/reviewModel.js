const { pool } = require("../../config/database");


// Find product
const findProductById = async (productId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      name,
      status
    FROM products
    WHERE id = ?
    `,
    [productId]
  );

  return rows[0];
};


// Find existing review by customer and product
const findReviewByCustomerAndProduct = async (
  customerId,
  productId
) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      customer_id,
      product_id,
      rating,
      comment,
      status,
      created_at,
      updated_at
    FROM product_reviews
    WHERE customer_id = ?
      AND product_id = ?
    `,
    [customerId, productId]
  );

  return rows[0];
};


// Find review by ID
const findReviewById = async (reviewId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      customer_id,
      product_id,
      rating,
      comment,
      status,
      created_at,
      updated_at
    FROM product_reviews
    WHERE id = ?
    `,
    [reviewId]
  );

  return rows[0];
};


// Create review
const createReview = async ({
  customerId,
  productId,
  rating,
  comment
}) => {
  const [result] = await pool.execute(
    `
    INSERT INTO product_reviews (
      customer_id,
      product_id,
      rating,
      comment,
      status
    )
    VALUES (?, ?, ?, ?, 'APPROVED')
    `,
    [
      customerId,
      productId,
      rating,
      comment
    ]
  );

  return result.insertId;
};


// Get customer's own reviews
const getCustomerReviews = async (customerId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      r.id,
      r.product_id,
      r.rating,
      r.comment,
      r.status,
      r.created_at,
      r.updated_at,

      p.name AS product_name,
      p.main_image,
      p.selling_price,
      p.mrp

    FROM product_reviews r

    INNER JOIN products p
      ON p.id = r.product_id

    WHERE r.customer_id = ?

    ORDER BY r.created_at DESC
    `,
    [customerId]
  );

  return rows;
};


// Update review
const updateReview = async ({
  reviewId,
  rating,
  comment
}) => {
  const [result] = await pool.execute(
    `
    UPDATE product_reviews
    SET
      rating = ?,
      comment = ?
    WHERE id = ?
    `,
    [
      rating,
      comment,
      reviewId
    ]
  );

  return result.affectedRows;
};


// Delete review
const deleteReview = async (reviewId) => {
  const [result] = await pool.execute(
    `
    DELETE FROM product_reviews
    WHERE id = ?
    `,
    [reviewId]
  );

  return result.affectedRows;
};


module.exports = {
  findProductById,
  findReviewByCustomerAndProduct,
  findReviewById,
  createReview,
  getCustomerReviews,
  updateReview,
  deleteReview
};