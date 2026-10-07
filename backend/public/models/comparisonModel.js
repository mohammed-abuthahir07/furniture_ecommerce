const { pool } = require("../../config/database");


/*
|--------------------------------------------------------------------------
| GET PRODUCTS FOR COMPARISON
|--------------------------------------------------------------------------
|
| Fetch multiple active products using their IDs.
|
*/

const getProductsForComparison = async (productIds) => {
  if (!productIds || productIds.length === 0) {
    return [];
  }

  const placeholders = productIds.map(() => "?").join(",");

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
        p.delivery_days,

        p.status,

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

      WHERE p.id IN (${placeholders})
        AND p.status = 'ACTIVE'
        AND c.status = 'ACTIVE'
    `,
    productIds
  );

  return rows;
};


/*
|--------------------------------------------------------------------------
| GET PRODUCT VARIANTS
|--------------------------------------------------------------------------
*/

const getProductComparisonVariants = async (productIds) => {
  if (!productIds || productIds.length === 0) {
    return [];
  }

  const placeholders = productIds.map(() => "?").join(",");

  const [rows] = await pool.execute(
    `
      SELECT
        id,
        product_id,
        variant_name,
        color,
        stock_quantity,
        status,

        CASE
          WHEN status = 'INACTIVE' THEN 'INACTIVE'
          WHEN stock_quantity <= 0 THEN 'SOLD OUT'
          ELSE 'AVAILABLE'
        END AS availability_status

      FROM product_variants

      WHERE product_id IN (${placeholders})

      ORDER BY
        product_id ASC,
        id ASC
    `,
    productIds
  );

  return rows;
};


module.exports = {
  getProductsForComparison,
  getProductComparisonVariants,
};