const { pool } = require("../../config/database");

// CREATE VARIANT
const createVariant = async (variantData) => {
  const {
    product_id,
    variant_name,
    color,
    stock_quantity,
  } = variantData;

  const [result] = await pool.execute(
    `INSERT INTO product_variants (
      product_id,
      variant_name,
      color,
      stock_quantity
    )
    VALUES (?, ?, ?, ?)`,
    [
      product_id,
      variant_name,
      color || null,
      stock_quantity ?? 0,
    ]
  );

  return result.insertId;
};

// GET ALL VARIANTS BY PRODUCT
const getVariantsByProductId = async (productId) => {
  const [rows] = await pool.execute(
    `SELECT
      id,
      product_id,
      variant_name,
      color,
      stock_quantity,
      status,
      CASE
        WHEN status = 'INACTIVE' THEN 'INACTIVE'
        WHEN stock_quantity = 0 THEN 'SOLD OUT'
        ELSE 'AVAILABLE'
      END AS availability_status,
      created_at,
      updated_at
    FROM product_variants
    WHERE product_id = ?
    ORDER BY id ASC`,
    [productId]
  );

  return rows;
};

// GET SINGLE VARIANT
const getVariantById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT
      pv.id,
      pv.product_id,
      p.name AS product_name,
      pv.variant_name,
      pv.color,
      pv.stock_quantity,
      pv.status,
      CASE
        WHEN pv.status = 'INACTIVE' THEN 'INACTIVE'
        WHEN pv.stock_quantity = 0 THEN 'SOLD OUT'
        ELSE 'AVAILABLE'
      END AS availability_status,
      pv.created_at,
      pv.updated_at
    FROM product_variants pv
    INNER JOIN products p
      ON pv.product_id = p.id
    WHERE pv.id = ?`,
    [id]
  );

  return rows[0];
};

// CHECK DUPLICATE VARIANT
const findVariantByName = async (productId, variantName, excludeId = null) => {
  let query = `
    SELECT id
    FROM product_variants
    WHERE product_id = ?
      AND LOWER(variant_name) = LOWER(?)
  `;

  const values = [productId, variantName];

  if (excludeId) {
    query += ` AND id != ?`;
    values.push(excludeId);
  }

  const [rows] = await pool.execute(query, values);

  return rows[0];
};

// UPDATE VARIANT
const updateVariant = async (id, variantData) => {
  const {
    variant_name,
    color,
    stock_quantity,
  } = variantData;

  const [result] = await pool.execute(
    `UPDATE product_variants
     SET
       variant_name = ?,
       color = ?,
       stock_quantity = ?
     WHERE id = ?`,
    [
      variant_name,
      color || null,
      stock_quantity,
      id,
    ]
  );

  return result.affectedRows;
};

// UPDATE STOCK ONLY
const updateVariantStock = async (id, stockQuantity) => {
  const [result] = await pool.execute(
    `UPDATE product_variants
     SET stock_quantity = ?
     WHERE id = ?`,
    [stockQuantity, id]
  );

  return result.affectedRows;
};

// UPDATE VARIANT STATUS
const updateVariantStatus = async (id, status) => {
  const [result] = await pool.execute(
    `UPDATE product_variants
     SET status = ?
     WHERE id = ?`,
    [status, id]
  );

  return result.affectedRows;
};

// DELETE VARIANT
const deleteVariant = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM product_variants
     WHERE id = ?`,
    [id]
  );

  return result.affectedRows;
};

module.exports = {
  createVariant,
  getVariantsByProductId,
  getVariantById,
  findVariantByName,
  updateVariant,
  updateVariantStock,
  updateVariantStatus,
  deleteVariant,
};