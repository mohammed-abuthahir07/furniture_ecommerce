const { pool } = require("../../config/database");


// Get review summary
const getReviewSummary = async (productId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      COUNT(*) AS total_reviews,
      COALESCE(ROUND(AVG(rating), 1), 0) AS average_rating,

      SUM(CASE WHEN rating = 5 THEN 1 ELSE 0 END) AS five_star,
      SUM(CASE WHEN rating = 4 THEN 1 ELSE 0 END) AS four_star,
      SUM(CASE WHEN rating = 3 THEN 1 ELSE 0 END) AS three_star,
      SUM(CASE WHEN rating = 2 THEN 1 ELSE 0 END) AS two_star,
      SUM(CASE WHEN rating = 1 THEN 1 ELSE 0 END) AS one_star

    FROM product_reviews

    WHERE product_id = ?
      AND status = 'APPROVED'
    `,
    [productId]
  );

  return rows[0];
};


// Get public reviews
const getPublicReviews = async (productId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      r.id,
      r.rating,
      r.comment,
      r.created_at,
      r.updated_at,

      c.id AS customer_id,
      c.name AS customer_name,
      c.profile_image

    FROM product_reviews r

    INNER JOIN customers c
      ON c.id = r.customer_id

    WHERE r.product_id = ?
      AND r.status = 'APPROVED'

    ORDER BY r.created_at DESC
    `,
    [productId]
  );

  return rows;
};


// Check product
const findActiveProduct = async (productId) => {
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


module.exports = {
  getReviewSummary,
  getPublicReviews,
  findActiveProduct
};