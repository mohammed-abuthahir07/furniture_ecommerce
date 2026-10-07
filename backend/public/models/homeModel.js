const { pool } = require("../../config/database");

/*
|--------------------------------------------------------------------------
| POPULAR / ACTIVE CATEGORIES
|--------------------------------------------------------------------------
*/

const getHomeCategories = async () => {
  const [rows] = await pool.execute(`
    SELECT
      c.id,
      c.name,
      c.description,
      c.image
    FROM categories c
    WHERE c.status = 'ACTIVE'
    ORDER BY c.name ASC
    LIMIT 8
  `);

  return rows;
};


/*
|--------------------------------------------------------------------------
| FEATURED PRODUCTS
|--------------------------------------------------------------------------
|
| Currently we use ACTIVE products ordered by newest.
| Later, if you add a featured flag to products, this query
| can be changed to use that flag.
|
*/

const getFeaturedProducts = async () => {
  const [rows] = await pool.execute(`
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
      p.delivery_days,

      COALESCE(
        ROUND(
          (
            SELECT AVG(pr.rating)
            FROM product_reviews pr
            WHERE pr.product_id = p.id
              AND pr.status = 'APPROVED'
          ),
          1
        ),
        0
      ) AS average_rating,

      (
        SELECT COUNT(*)
        FROM product_reviews pr
        WHERE pr.product_id = p.id
          AND pr.status = 'APPROVED'
      ) AS total_reviews

    FROM products p

    INNER JOIN categories c
      ON c.id = p.category_id

    WHERE p.status = 'ACTIVE'
      AND c.status = 'ACTIVE'

    ORDER BY p.created_at DESC

    LIMIT 8
  `);

  return rows;
};


/*
|--------------------------------------------------------------------------
| NEW ARRIVALS
|--------------------------------------------------------------------------
*/

const getNewArrivals = async () => {
  const [rows] = await pool.execute(`
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
      p.delivery_days,

      COALESCE(
        ROUND(
          (
            SELECT AVG(pr.rating)
            FROM product_reviews pr
            WHERE pr.product_id = p.id
              AND pr.status = 'APPROVED'
          ),
          1
        ),
        0
      ) AS average_rating,

      (
        SELECT COUNT(*)
        FROM product_reviews pr
        WHERE pr.product_id = p.id
          AND pr.status = 'APPROVED'
      ) AS total_reviews

    FROM products p

    INNER JOIN categories c
      ON c.id = p.category_id

    WHERE p.status = 'ACTIVE'
      AND c.status = 'ACTIVE'

    ORDER BY p.created_at DESC

    LIMIT 8
  `);

  return rows;
};


/*
|--------------------------------------------------------------------------
| BEST SELLING PRODUCTS
|--------------------------------------------------------------------------
|
| We calculate sales using order_items.
|
| CANCELLED orders are excluded.
|
*/

const getBestSellingProducts = async () => {
  const [rows] = await pool.execute(`
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
      p.delivery_days,

      COALESCE(SUM(
        CASE
          WHEN o.order_status != 'CANCELLED'
          THEN oi.quantity
          ELSE 0
        END
      ), 0) AS total_sold,

      COALESCE(
        ROUND(
          (
            SELECT AVG(pr.rating)
            FROM product_reviews pr
            WHERE pr.product_id = p.id
              AND pr.status = 'APPROVED'
          ),
          1
        ),
        0
      ) AS average_rating,

      (
        SELECT COUNT(*)
        FROM product_reviews pr
        WHERE pr.product_id = p.id
          AND pr.status = 'APPROVED'
      ) AS total_reviews

    FROM products p

    INNER JOIN categories c
      ON c.id = p.category_id

    LEFT JOIN order_items oi
      ON oi.product_id = p.id

    LEFT JOIN orders o
      ON o.id = oi.order_id

    WHERE p.status = 'ACTIVE'
      AND c.status = 'ACTIVE'

    GROUP BY
      p.id,
      p.category_id,
      c.name,
      p.name,
      p.brand,
      p.main_image,
      p.short_description,
      p.mrp,
      p.selling_price,
      p.material,
      p.wood_type,
      p.delivery_days

    ORDER BY
      total_sold DESC,
      average_rating DESC,
      p.id DESC

    LIMIT 8
  `);

  return rows;
};


/*
|--------------------------------------------------------------------------
| TOP RATED PRODUCTS
|--------------------------------------------------------------------------
*/

const getTopRatedProducts = async () => {
  const [rows] = await pool.execute(`
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
      p.delivery_days,

      ROUND(AVG(pr.rating), 1) AS average_rating,

      COUNT(pr.id) AS total_reviews

    FROM products p

    INNER JOIN categories c
      ON c.id = p.category_id

    INNER JOIN product_reviews pr
      ON pr.product_id = p.id
      AND pr.status = 'APPROVED'

    WHERE p.status = 'ACTIVE'
      AND c.status = 'ACTIVE'

    GROUP BY
      p.id,
      p.category_id,
      c.name,
      p.name,
      p.brand,
      p.main_image,
      p.short_description,
      p.mrp,
      p.selling_price,
      p.material,
      p.wood_type,
      p.delivery_days

    HAVING COUNT(pr.id) > 0

    ORDER BY
      average_rating DESC,
      total_reviews DESC,
      p.id DESC

    LIMIT 8
  `);

  return rows;
};


/*
|--------------------------------------------------------------------------
| ACTIVE OFFERS
|--------------------------------------------------------------------------
*/

const getHomeOffers = async () => {
  const [rows] = await pool.execute(`
    SELECT
      id,
      title,
      description,
      image,
      discount_type,
      discount_value,
      start_date,
      end_date
    FROM offers
    WHERE status = 'ACTIVE'
      AND CURDATE() >= start_date
      AND CURDATE() <= end_date
    ORDER BY end_date ASC
    LIMIT 6
  `);

  return rows;
};


module.exports = {
  getHomeCategories,
  getFeaturedProducts,
  getNewArrivals,
  getBestSellingProducts,
  getTopRatedProducts,
  getHomeOffers,
};