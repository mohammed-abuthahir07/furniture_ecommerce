const { pool } = require("../../config/database");

// ======================================================
// GET ALL ACTIVE PRODUCTS
// ======================================================

const getActiveProducts = async () => {
  const [rows] = await pool.execute(
    `
      SELECT
        p.id,
        p.category_id,
        c.name AS category_name,

        p.name,
        p.brand,
        p.main_image,
        p.short_description,

        p.mrp,
        p.selling_price,

        p.material,
        p.wood_type,

        p.length,
        p.width,
        p.height,
        p.weight,

        p.seating_capacity,
        p.assembly_required,
        p.delivery_days,

        COALESCE(review_stats.average_rating, 0) AS average_rating,
        COALESCE(review_stats.total_reviews, 0) AS total_reviews

      FROM products p

      INNER JOIN categories c
        ON c.id = p.category_id

      LEFT JOIN (
        SELECT
          product_id,
          ROUND(AVG(rating), 1) AS average_rating,
          COUNT(*) AS total_reviews
        FROM product_reviews
        WHERE status = 'APPROVED'
        GROUP BY product_id
      ) review_stats
        ON review_stats.product_id = p.id

      WHERE p.status = 'ACTIVE'
        AND c.status = 'ACTIVE'

      ORDER BY p.id DESC
    `
  );

  return rows;
};

// ======================================================
// GET ONE ACTIVE PRODUCT
// ======================================================

const getActiveProductById = async (productId) => {
  const [rows] = await pool.execute(
    `
      SELECT
        p.id,
        p.category_id,
        c.name AS category_name,

        p.name,
        p.brand,
        p.main_image,

        p.short_description,
        p.description,

        p.mrp,
        p.selling_price,

        p.material,
        p.wood_type,

        p.length,
        p.width,
        p.height,
        p.weight,

        p.seating_capacity,
        p.assembly_required,
        p.delivery_days

      FROM products p

      INNER JOIN categories c
        ON c.id = p.category_id

      WHERE p.id = ?
        AND p.status = 'ACTIVE'
        AND c.status = 'ACTIVE'

      LIMIT 1
    `,
    [productId]
  );

  return rows[0] || null;
};

// ======================================================
// GET PRODUCT GALLERY IMAGES
// ======================================================

const getActiveProductImages = async (productId) => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        image,
        image_title,
        sort_order

      FROM product_images

      WHERE product_id = ?

      ORDER BY sort_order ASC, id ASC
    `,
    [productId]
  );

  return rows;
};

// ======================================================
// GET ACTIVE PRODUCT VARIANTS
// ======================================================

const getActiveProductVariants = async (productId) => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        variant_name,
        color,

        stock_quantity,

        CASE
          WHEN stock_quantity <= 0 THEN 'SOLD OUT'
          ELSE 'AVAILABLE'
        END AS availability_status

      FROM product_variants

      WHERE product_id = ?
        AND status = 'ACTIVE'

      ORDER BY id ASC
    `,
    [productId]
  );

  return rows;
};

// ======================================================
// GET PRODUCT RATING SUMMARY
// ======================================================

const getProductRatingSummary = async (productId) => {
  const [rows] = await pool.execute(
    `
      SELECT
        COALESCE(ROUND(AVG(rating), 1), 0) AS average_rating,
        COUNT(*) AS total_reviews

      FROM product_reviews

      WHERE product_id = ?
        AND status = 'APPROVED'
    `,
    [productId]
  );

  return {
    average_rating: Number(rows[0]?.average_rating || 0),
    total_reviews: Number(rows[0]?.total_reviews || 0),
  };
};

// ======================================================
// GET APPROVED PRODUCT REVIEWS / COMMENTS
// ======================================================

const getProductReviews = async (productId) => {
  const [rows] = await pool.execute(
    `
      SELECT
        pr.id,
        pr.rating,
        pr.comment,
        pr.created_at,

        c.name AS customer_name

      FROM product_reviews pr

      INNER JOIN customers c
        ON c.id = pr.customer_id

      WHERE pr.product_id = ?
        AND pr.status = 'APPROVED'
        AND c.status = 'ACTIVE'

      ORDER BY pr.created_at DESC
    `,
    [productId]
  );

  return rows;
};

module.exports = {
  getActiveProducts,
  getActiveProductById,
  getActiveProductImages,
  getActiveProductVariants,
  getProductRatingSummary,
  getProductReviews,
};