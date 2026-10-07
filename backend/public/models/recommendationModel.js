const { pool } = require("../../config/database");

// GET RECOMMENDED PRODUCTS FOR A PRODUCT
const getRecommendedProducts = async (productId, limit = 8) => {
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
        ) AS total_reviews,

        (
          CASE
            WHEN p.category_id = (
              SELECT category_id
              FROM products
              WHERE id = ?
            )
            THEN 3
            ELSE 0
          END

          +

          CASE
            WHEN p.material = (
              SELECT material
              FROM products
              WHERE id = ?
            )
            THEN 2
            ELSE 0
          END

          +

          CASE
            WHEN p.wood_type = (
              SELECT wood_type
              FROM products
              WHERE id = ?
            )
            THEN 2
            ELSE 0
          END
        ) AS recommendation_score

      FROM products p

      INNER JOIN categories c
        ON c.id = p.category_id

      WHERE p.status = 'ACTIVE'
        AND c.status = 'ACTIVE'
        AND p.id != ?

        AND (
          p.category_id = (
            SELECT category_id
            FROM products
            WHERE id = ?
          )

          OR

          p.material = (
            SELECT material
            FROM products
            WHERE id = ?
          )

          OR

          p.wood_type = (
            SELECT wood_type
            FROM products
            WHERE id = ?
          )
        )

      ORDER BY
        recommendation_score DESC,
        average_rating DESC,
        total_reviews DESC,
        p.id DESC

      LIMIT ${limit}
    `,
    [
      productId,
      productId,
      productId,
      productId,
      productId,
      productId,
      productId,
    ]
  );

  return rows;
};


// CHECK WHETHER PRODUCT EXISTS
const getActiveProductForRecommendation = async (productId) => {
  const [rows] = await pool.execute(
    `
      SELECT
        p.id,
        p.category_id,
        p.material,
        p.wood_type
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


module.exports = {
  getRecommendedProducts,
  getActiveProductForRecommendation,
};