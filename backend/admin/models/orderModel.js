const { pool } = require("../../config/database");

// =====================================================
// GET ALL ORDERS
// =====================================================
const getAllOrders = async () => {
  const [rows] = await pool.execute(`
    SELECT
      id,
      order_number,
      customer_id,
      customer_name,
      customer_email,
      customer_phone,
      subtotal,
      discount_amount,
      shipping_charge,
      total_amount,
      payment_method,
      payment_status,
      order_status,
      created_at,
      updated_at
    FROM orders
    ORDER BY created_at DESC
  `);

  return rows;
};

// =====================================================
// GET SINGLE ORDER
// =====================================================
const getOrderById = async (id) => {
  const [orderRows] = await pool.execute(
    `
    SELECT
      id,
      order_number,
      customer_id,
      customer_name,
      customer_email,
      customer_phone,

      shipping_address,
      shipping_city,
      shipping_state,
      shipping_pincode,

      subtotal,
      discount_amount,
      shipping_charge,
      total_amount,

      payment_method,
      payment_status,
      order_status,

      notes,
      created_at,
      updated_at
    FROM orders
    WHERE id = ?
    `,
    [id]
  );

  if (orderRows.length === 0) {
    return null;
  }

  const [itemRows] = await pool.execute(
    `
    SELECT
      id,
      order_id,
      product_id,
      variant_id,
      product_name,
      variant_name,
      color,
      quantity,
      unit_price,
      subtotal,
      created_at
    FROM order_items
    WHERE order_id = ?
    ORDER BY id ASC
    `,
    [id]
  );

  return {
    ...orderRows[0],
    items: itemRows,
  };
};

// =====================================================
// UPDATE ORDER STATUS
// =====================================================
const updateOrderStatus = async (id, orderStatus) => {
  const [result] = await pool.execute(
    `
    UPDATE orders
    SET order_status = ?
    WHERE id = ?
    `,
    [orderStatus, id]
  );

  return result.affectedRows;
};

module.exports = {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
};