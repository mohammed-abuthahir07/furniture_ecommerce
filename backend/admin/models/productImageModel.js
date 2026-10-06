const { pool } = require("../../config/database");

// CREATE PRODUCT IMAGE
const createProductImage = async (imageData) => {
  const {
    product_id,
    image,
    image_title,
    sort_order,
  } = imageData;

  const [result] = await pool.execute(
    `INSERT INTO product_images (
      product_id,
      image,
      image_title,
      sort_order
    )
    VALUES (?, ?, ?, ?)`,
    [
      product_id,
      image,
      image_title || null,
      sort_order ?? 0,
    ]
  );

  return result.insertId;
};

// GET ALL IMAGES BY PRODUCT
const getImagesByProductId = async (productId) => {
  const [rows] = await pool.execute(
    `SELECT
      id,
      product_id,
      image,
      image_title,
      sort_order,
      created_at
    FROM product_images
    WHERE product_id = ?
    ORDER BY sort_order ASC, id ASC`,
    [productId]
  );

  return rows;
};

// GET SINGLE IMAGE
const getProductImageById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT
      pi.id,
      pi.product_id,
      p.name AS product_name,
      pi.image,
      pi.image_title,
      pi.sort_order,
      pi.created_at
    FROM product_images pi
    INNER JOIN products p
      ON pi.product_id = p.id
    WHERE pi.id = ?`,
    [id]
  );

  return rows[0];
};

// UPDATE IMAGE DETAILS
const updateProductImage = async (id, imageData) => {
  const {
    image_title,
    sort_order,
  } = imageData;

  const [result] = await pool.execute(
    `UPDATE product_images
     SET
       image_title = ?,
       sort_order = ?
     WHERE id = ?`,
    [
      image_title || null,
      sort_order ?? 0,
      id,
    ]
  );

  return result.affectedRows;
};

// DELETE IMAGE
const deleteProductImage = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM product_images
     WHERE id = ?`,
    [id]
  );

  return result.affectedRows;
};

module.exports = {
  createProductImage,
  getImagesByProductId,
  getProductImageById,
  updateProductImage,
  deleteProductImage,
};