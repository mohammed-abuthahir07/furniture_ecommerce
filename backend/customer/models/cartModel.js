const { pool } = require("../../config/database");


// Find product
const findProductById = async (productId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      name,
      brand,
      main_image,
      mrp,
      selling_price,
      status
    FROM products
    WHERE id = ?
    `,
    [productId]
  );

  return rows[0];
};


// Find variant
const findVariantById = async (variantId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      product_id,
      variant_name,
      color,
      stock_quantity,
      status
    FROM product_variants
    WHERE id = ?
    `,
    [variantId]
  );

  return rows[0];
};


// Find cart item
const findCartItem = async (
  customerId,
  productId,
  variantId
) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      customer_id,
      product_id,
      variant_id,
      quantity,
      created_at,
      updated_at
    FROM customer_carts
    WHERE customer_id = ?
      AND product_id = ?
      AND variant_id = ?
    `,
    [
      customerId,
      productId,
      variantId
    ]
  );

  return rows[0];
};


// Find cart item by ID
const findCartItemById = async (
  customerId,
  cartItemId
) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      customer_id,
      product_id,
      variant_id,
      quantity,
      created_at,
      updated_at
    FROM customer_carts
    WHERE id = ?
      AND customer_id = ?
    `,
    [
      cartItemId,
      customerId
    ]
  );

  return rows[0];
};


// Create cart item
const createCartItem = async ({
  customerId,
  productId,
  variantId,
  quantity
}) => {
  const [result] = await pool.execute(
    `
    INSERT INTO customer_carts (
      customer_id,
      product_id,
      variant_id,
      quantity
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      customerId,
      productId,
      variantId,
      quantity
    ]
  );

  return result.insertId;
};


// Update quantity
const updateCartItemQuantity = async (
  customerId,
  cartItemId,
  quantity
) => {
  const [result] = await pool.execute(
    `
    UPDATE customer_carts
    SET quantity = ?
    WHERE id = ?
      AND customer_id = ?
    `,
    [
      quantity,
      cartItemId,
      customerId
    ]
  );

  return result.affectedRows;
};


// Get customer's cart
const getCustomerCart = async (customerId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      c.id AS cart_item_id,

      c.product_id,
      c.variant_id,
      c.quantity,

      p.name AS product_name,
      p.brand,
      p.main_image,
      p.mrp,
      p.selling_price,
      p.status AS product_status,

      v.variant_name,
      v.color,
      v.stock_quantity,
      v.status AS variant_status,

      (p.selling_price * c.quantity) AS item_subtotal

    FROM customer_carts c

    INNER JOIN products p
      ON p.id = c.product_id

    INNER JOIN product_variants v
      ON v.id = c.variant_id

    WHERE c.customer_id = ?

    ORDER BY c.created_at DESC
    `,
    [customerId]
  );

  return rows;
};


// Delete cart item
const deleteCartItem = async (
  customerId,
  cartItemId
) => {
  const [result] = await pool.execute(
    `
    DELETE FROM customer_carts
    WHERE id = ?
      AND customer_id = ?
    `,
    [
      cartItemId,
      customerId
    ]
  );

  return result.affectedRows;
};


// Clear cart
const clearCustomerCart = async (customerId) => {
  const [result] = await pool.execute(
    `
    DELETE FROM customer_carts
    WHERE customer_id = ?
    `,
    [customerId]
  );

  return result.affectedRows;
};


module.exports = {
  findProductById,
  findVariantById,
  findCartItem,
  findCartItemById,
  createCartItem,
  updateCartItemQuantity,
  getCustomerCart,
  deleteCartItem,
  clearCustomerCart
};