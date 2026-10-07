const { pool } = require("../../config/database");

const addToWishlist = async (customerId, productId) => {
  const [result] = await pool.execute(
    `
    INSERT INTO customer_wishlist (
      customer_id,
      product_id
    )
    VALUES (?, ?)
    `,
    [customerId, productId]
  );

  return result.insertId;
};

const findWishlistItem = async (customerId, productId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      customer_id,
      product_id,
      created_at
    FROM customer_wishlist
    WHERE customer_id = ?
      AND product_id = ?
    `,
    [customerId, productId]
  );

  return rows[0];
};

const getCustomerWishlist = async (customerId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      w.id,
      w.product_id,
      w.created_at,

      p.name,
      p.brand,
      p.main_image,
      p.short_description,
      p.mrp,
      p.selling_price,
      p.material,
      p.wood_type,
      p.status AS product_status,

      c.id AS category_id,
      c.name AS category_name

    FROM customer_wishlist w

    INNER JOIN products p
      ON p.id = w.product_id

    INNER JOIN categories c
      ON c.id = p.category_id

    WHERE w.customer_id = ?

    ORDER BY w.created_at DESC
    `,
    [customerId]
  );

  return rows;
};

const getWishlistItemByProduct = async (
  customerId,
  productId
) => {
  const [rows] = await pool.execute(
    `
    SELECT
      w.id,
      w.customer_id,
      w.product_id,
      w.created_at,

      p.name,
      p.main_image,
      p.selling_price,
      p.mrp,
      p.status AS product_status

    FROM customer_wishlist w

    INNER JOIN products p
      ON p.id = w.product_id

    WHERE w.customer_id = ?
      AND w.product_id = ?
    `,
    [customerId, productId]
  );

  return rows[0];
};

const deleteWishlistItem = async (
  customerId,
  productId
) => {
  const [result] = await pool.execute(
    `
    DELETE FROM customer_wishlist
    WHERE customer_id = ?
      AND product_id = ?
    `,
    [customerId, productId]
  );

  return result.affectedRows;
};

module.exports = {
  addToWishlist,
  findWishlistItem,
  getCustomerWishlist,
  getWishlistItemByProduct,
  deleteWishlistItem
};