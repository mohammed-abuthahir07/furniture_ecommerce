const { pool } = require("../../config/database");

// ============================================================
// GET ALL INVENTORY
// ============================================================

const getAllInventory = async () => {
  const [rows] = await pool.execute(`
    SELECT
      pv.id AS variant_id,
      pv.product_id,

      p.name AS product_name,
      p.main_image,

      c.id AS category_id,
      c.name AS category_name,

      pv.variant_name,
      pv.color,
      pv.stock_quantity,
      pv.status AS variant_status,

      p.status AS product_status,

      CASE
        WHEN pv.status = 'INACTIVE'
          THEN 'INACTIVE'

        WHEN pv.stock_quantity = 0
          THEN 'SOLD OUT'

        WHEN pv.stock_quantity BETWEEN 1 AND 5
          THEN 'LOW STOCK'

        ELSE 'AVAILABLE'
      END AS availability_status,

      pv.created_at,
      pv.updated_at

    FROM product_variants pv

    INNER JOIN products p
      ON pv.product_id = p.id

    INNER JOIN categories c
      ON p.category_id = c.id

    ORDER BY pv.updated_at DESC
  `);

  return rows;
};


// ============================================================
// GET INVENTORY SUMMARY
// ============================================================

const getInventorySummary = async () => {
  const [rows] = await pool.execute(`
    SELECT

      COUNT(*) AS total_variants,

      COALESCE(
        SUM(pv.stock_quantity),
        0
      ) AS total_stock_quantity,

      SUM(
        CASE
          WHEN pv.status = 'ACTIVE'
               AND pv.stock_quantity > 5
          THEN 1
          ELSE 0
        END
      ) AS available_variants,

      SUM(
        CASE
          WHEN pv.status = 'ACTIVE'
               AND pv.stock_quantity BETWEEN 1 AND 5
          THEN 1
          ELSE 0
        END
      ) AS low_stock_variants,

      SUM(
        CASE
          WHEN pv.status = 'ACTIVE'
               AND pv.stock_quantity = 0
          THEN 1
          ELSE 0
        END
      ) AS out_of_stock_variants,

      SUM(
        CASE
          WHEN pv.status = 'INACTIVE'
          THEN 1
          ELSE 0
        END
      ) AS inactive_variants

    FROM product_variants pv
  `);

  return rows[0];
};


// ============================================================
// GET LOW STOCK INVENTORY
// ============================================================

const getLowStockInventory = async () => {
  const [rows] = await pool.execute(`
    SELECT
      pv.id AS variant_id,
      pv.product_id,

      p.name AS product_name,
      p.main_image,

      c.id AS category_id,
      c.name AS category_name,

      pv.variant_name,
      pv.color,
      pv.stock_quantity,

      pv.status AS variant_status,
      p.status AS product_status,

      CASE
        WHEN pv.stock_quantity BETWEEN 1 AND 5
          THEN 'LOW STOCK'
        ELSE 'AVAILABLE'
      END AS availability_status,

      pv.updated_at

    FROM product_variants pv

    INNER JOIN products p
      ON pv.product_id = p.id

    INNER JOIN categories c
      ON p.category_id = c.id

    WHERE pv.status = 'ACTIVE'
      AND pv.stock_quantity BETWEEN 1 AND 5

    ORDER BY
      pv.stock_quantity ASC,
      pv.updated_at DESC
  `);

  return rows;
};


// ============================================================
// GET OUT OF STOCK INVENTORY
// ============================================================

const getOutOfStockInventory = async () => {
  const [rows] = await pool.execute(`
    SELECT
      pv.id AS variant_id,
      pv.product_id,

      p.name AS product_name,
      p.main_image,

      c.id AS category_id,
      c.name AS category_name,

      pv.variant_name,
      pv.color,
      pv.stock_quantity,

      pv.status AS variant_status,
      p.status AS product_status,

      CASE
        WHEN pv.status = 'INACTIVE'
          THEN 'INACTIVE'

        WHEN pv.stock_quantity = 0
          THEN 'SOLD OUT'

        ELSE 'AVAILABLE'
      END AS availability_status,

      pv.updated_at

    FROM product_variants pv

    INNER JOIN products p
      ON pv.product_id = p.id

    INNER JOIN categories c
      ON p.category_id = c.id

    WHERE pv.status = 'ACTIVE'
      AND pv.stock_quantity = 0

    ORDER BY pv.updated_at DESC
  `);

  return rows;
};


// ============================================================
// GET INVENTORY BY PRODUCT
// ============================================================

const getInventoryByProduct = async (productId) => {
  // ----------------------------------------------------------
  // PRODUCT INFORMATION
  // ----------------------------------------------------------

  const [productRows] = await pool.execute(
    `
    SELECT
      p.id,
      p.name,
      p.brand,
      p.main_image,
      p.status,

      c.id AS category_id,
      c.name AS category_name

    FROM products p

    INNER JOIN categories c
      ON p.category_id = c.id

    WHERE p.id = ?
    `,
    [productId]
  );

  if (productRows.length === 0) {
    return null;
  }

  const product = productRows[0];


  // ----------------------------------------------------------
  // PRODUCT VARIANTS
  // ----------------------------------------------------------

  const [variantRows] = await pool.execute(
    `
    SELECT
      pv.id AS variant_id,
      pv.product_id,

      pv.variant_name,
      pv.color,

      pv.stock_quantity,
      pv.status,

      CASE
        WHEN pv.status = 'INACTIVE'
          THEN 'INACTIVE'

        WHEN pv.stock_quantity = 0
          THEN 'SOLD OUT'

        WHEN pv.stock_quantity BETWEEN 1 AND 5
          THEN 'LOW STOCK'

        ELSE 'AVAILABLE'
      END AS availability_status,

      pv.created_at,
      pv.updated_at

    FROM product_variants pv

    WHERE pv.product_id = ?

    ORDER BY pv.id ASC
    `,
    [productId]
  );


  return {
    ...product,
    variants: variantRows,
  };
};


// ============================================================
// UPDATE VARIANT STOCK
// ============================================================

const updateVariantStock = async (variantId, stockQuantity) => {
  const [result] = await pool.execute(
    `
    UPDATE product_variants

    SET stock_quantity = ?

    WHERE id = ?
    `,
    [
      stockQuantity,
      variantId,
    ]
  );

  return result.affectedRows;
};


// ============================================================
// GET VARIANT BY ID
// ============================================================

const getVariantById = async (variantId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      pv.id AS variant_id,
      pv.product_id,

      pv.variant_name,
      pv.color,
      pv.stock_quantity,
      pv.status,

      p.name AS product_name,
      p.main_image,

      c.id AS category_id,
      c.name AS category_name

    FROM product_variants pv

    INNER JOIN products p
      ON pv.product_id = p.id

    INNER JOIN categories c
      ON p.category_id = c.id

    WHERE pv.id = ?
    `,
    [variantId]
  );

  return rows[0];
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getAllInventory,
  getInventorySummary,
  getLowStockInventory,
  getOutOfStockInventory,
  getInventoryByProduct,
  getVariantById,
  updateVariantStock,
};