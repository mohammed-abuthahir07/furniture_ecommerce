const fs = require("fs");
const path = require("path");
const { pool } = require("../../config/database");

const MAX_IMAGES_PER_VARIANT = 12;
const uploadDirectory = path.join(__dirname, "../../uploads/products");

const removeImageFiles = (imagePaths = []) => {
  imagePaths.forEach((imagePath) => {
    if (typeof imagePath !== "string" || !imagePath.startsWith("/uploads/products/")) {
      return;
    }
    const fileName = path.basename(imagePath);
    if (!/^product-\d+-\d+\.(jpg|jpeg|png|webp)$/i.test(fileName)) {
      return;
    }
    fs.unlink(path.join(uploadDirectory, fileName), () => {});
  });
};

const getImagesByVariantId = async (variantId) => {
  const [rows] = await pool.execute(
    `SELECT
      id,
      variant_id,
      image,
      image_title,
      sort_order,
      created_at
    FROM product_variant_images
    WHERE variant_id = ?
    ORDER BY sort_order ASC, id ASC`,
    [variantId]
  );
  return rows;
};

const getImagesByVariantIds = async (variantIds) => {
  if (!Array.isArray(variantIds) || variantIds.length === 0) return [];
  const placeholders = variantIds.map(() => "?").join(", ");
  const [rows] = await pool.execute(
    `SELECT
      id,
      variant_id,
      image,
      image_title,
      sort_order
    FROM product_variant_images
    WHERE variant_id IN (${placeholders})
    ORDER BY variant_id ASC, sort_order ASC, id ASC`,
    variantIds
  );
  return rows;
};

const getVariantImageById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT
      vi.id,
      vi.variant_id,
      vi.image,
      vi.image_title,
      vi.sort_order,
      vi.created_at,
      pv.variant_name,
      pv.product_id
    FROM product_variant_images vi
    INNER JOIN product_variants pv
      ON pv.id = vi.variant_id
    WHERE vi.id = ?`,
    [id]
  );
  return rows[0];
};

const createVariantImages = async (variantId, files, title) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [countRows] = await connection.execute(
      `SELECT COUNT(*) AS total
       FROM product_variant_images
       WHERE variant_id = ?
       FOR UPDATE`,
      [variantId]
    );
    const existingCount = Number(countRows[0].total);
    if (existingCount + files.length > MAX_IMAGES_PER_VARIANT) {
      const error = new Error(
        `A finish can have up to ${MAX_IMAGES_PER_VARIANT} photos.`
      );
      error.statusCode = 400;
      throw error;
    }

    const [maxRows] = await connection.execute(
      `SELECT COALESCE(MAX(sort_order), 0) AS max_order
       FROM product_variant_images
       WHERE variant_id = ?`,
      [variantId]
    );
    let sortOrder = Number(maxRows[0].max_order);
    const createdIds = [];

    for (let index = 0; index < files.length; index += 1) {
      sortOrder += 1;
      const imageTitle = title
        ? (files.length === 1 ? title : `${title} ${index + 1}`).slice(0, 150)
        : null;
      const [result] = await connection.execute(
        `INSERT INTO product_variant_images (
          variant_id,
          image,
          image_title,
          sort_order
        ) VALUES (?, ?, ?, ?)`,
        [
          variantId,
          `/uploads/products/${files[index].filename}`,
          imageTitle,
          sortOrder,
        ]
      );
      createdIds.push(result.insertId);
    }

    await connection.commit();
    return createdIds;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const updateVariantImage = async (id, imageData) => {
  const [result] = await pool.execute(
    `UPDATE product_variant_images
     SET image_title = ?, sort_order = ?
     WHERE id = ?`,
    [imageData.image_title || null, imageData.sort_order ?? 0, id]
  );
  return result.affectedRows;
};

const reorderVariantImages = async (variantId, orderedIds) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    for (let index = 0; index < orderedIds.length; index += 1) {
      const [result] = await connection.execute(
        `UPDATE product_variant_images
         SET sort_order = ?
         WHERE id = ? AND variant_id = ?`,
        [index + 1, orderedIds[index], variantId]
      );
      if (result.affectedRows !== 1) {
        const error = new Error("One of these photos does not belong to this finish.");
        error.statusCode = 400;
        throw error;
      }
    }
    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};

const deleteVariantImage = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM product_variant_images WHERE id = ?`,
    [id]
  );
  return result.affectedRows;
};

module.exports = {
  MAX_IMAGES_PER_VARIANT,
  removeImageFiles,
  getImagesByVariantId,
  getImagesByVariantIds,
  getVariantImageById,
  createVariantImages,
  updateVariantImage,
  reorderVariantImages,
  deleteVariantImage,
};
