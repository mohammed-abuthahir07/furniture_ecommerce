const { pool } = require("../../config/database");

/*
|--------------------------------------------------------------------------
| Generate Order Number
|--------------------------------------------------------------------------
*/

const generateOrderNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);

  return `ORD-${timestamp}-${random}`;
};

/*
|--------------------------------------------------------------------------
| Get Customer Cart Items
|--------------------------------------------------------------------------
*/

const getCustomerCartItems = async (customerId, connection) => {
  const [rows] = await connection.execute(
    `
    SELECT
      c.id AS cart_id,
      c.customer_id,
      c.product_id,
      c.variant_id,
      c.quantity,

      p.name AS product_name,
      p.main_image,
      p.selling_price,
      p.status AS product_status,

      v.variant_name,
      v.color,
      v.stock_quantity,
      v.status AS variant_status

    FROM customer_carts c

    INNER JOIN products p
      ON c.product_id = p.id

    INNER JOIN product_variants v
      ON c.variant_id = v.id

    WHERE c.customer_id = ?

    ORDER BY c.created_at ASC

    FOR UPDATE
    `,
    [customerId]
  );

  return rows;
};

/*
|--------------------------------------------------------------------------
| Create Order
|--------------------------------------------------------------------------
*/

const createOrder = async (connection, orderData) => {
  const orderNumber = generateOrderNumber();

  const {
    customerId,
    customerName,
    customerEmail,
    customerPhone,
    shippingAddress,
    shippingCity,
    shippingState,
    shippingPincode,
    alternativeAddress,
    subtotal,
    discountAmount,
    shippingCharge,
    totalAmount,
    paymentMethod,
    paymentStatus,
    orderStatus,
    notes,
  } = orderData;

  const [result] = await connection.execute(
    `
    INSERT INTO orders (
      order_number,
      customer_id,
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      shipping_city,
      shipping_state,
      shipping_pincode,
      alternative_address,
      subtotal,
      discount_amount,
      shipping_charge,
      total_amount,
      payment_method,
      payment_status,
      order_status,
      notes
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      orderNumber,
      customerId,
      customerName,
      customerEmail,
      customerPhone,
      shippingAddress,
      shippingCity,
      shippingState,
      shippingPincode,
      alternativeAddress,
      subtotal,
      discountAmount,
      shippingCharge,
      totalAmount,
      paymentMethod,
      paymentStatus,
      orderStatus,
      notes,
    ]
  );

  return {
    id: result.insertId,
    orderNumber,
  };
};

/*
|--------------------------------------------------------------------------
| Create Order Item
|--------------------------------------------------------------------------
*/

const createOrderItem = async (connection, itemData) => {
  const {
    orderId,
    productId,
    variantId,
    productName,
    variantName,
    color,
    quantity,
    unitPrice,
    itemSubtotal,
  } = itemData;

  const [result] = await connection.execute(
    `
    INSERT INTO order_items (
      order_id,
      product_id,
      variant_id,
      product_name,
      variant_name,
      color,
      quantity,
      unit_price,
      subtotal
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      orderId,
      productId,
      variantId,
      productName,
      variantName,
      color,
      quantity,
      unitPrice,
      itemSubtotal,
    ]
  );

  return result.insertId;
};

/*
|--------------------------------------------------------------------------
| Reduce Variant Stock
|--------------------------------------------------------------------------
*/

const reduceVariantStock = async (
  connection,
  variantId,
  quantity
) => {
  const [result] = await connection.execute(
    `
    UPDATE product_variants
    SET stock_quantity = stock_quantity - ?
    WHERE id = ?
      AND stock_quantity >= ?
      AND status = 'ACTIVE'
    `,
    [quantity, variantId, quantity]
  );

  if (result.affectedRows !== 1) {
    throw new Error(
      "Insufficient stock or variant is inactive"
    );
  }
};

/*
|--------------------------------------------------------------------------
| Clear Customer Cart
|--------------------------------------------------------------------------
*/

const clearCustomerCart = async (connection, customerId) => {
  await connection.execute(
    `
    DELETE FROM customer_carts
    WHERE customer_id = ?
    `,
    [customerId]
  );
};

/*
|--------------------------------------------------------------------------
| Get Customer Orders
|--------------------------------------------------------------------------
*/

const getCustomerOrders = async (customerId) => {
  const [rows] = await pool.execute(
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
      alternative_address,
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

    WHERE customer_id = ?

    ORDER BY created_at DESC
    `,
    [customerId]
  );

  return rows;
};

/*
|--------------------------------------------------------------------------
| Get Customer Order By ID
|--------------------------------------------------------------------------
*/

const getCustomerOrderById = async (
  customerId,
  orderId
) => {
  const [orders] = await pool.execute(
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
      alternative_address,
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
      AND customer_id = ?
    `,
    [orderId, customerId]
  );

  if (orders.length === 0) {
    return null;
  }

  const order = orders[0];

  const [items] = await pool.execute(
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
    [order.id]
  );

  order.items = items;

  return order;
};

/*
|--------------------------------------------------------------------------
| Get Customer Order For Cancellation
|--------------------------------------------------------------------------
*/

const getCustomerOrderForCancellation = async (
  connection,
  customerId,
  orderId
) => {
  const [orders] = await connection.execute(
    `
    SELECT
      id,
      order_number,
      customer_id,
      order_status
    FROM orders
    WHERE id = ?
      AND customer_id = ?
    FOR UPDATE
    `,
    [orderId, customerId]
  );

  if (orders.length === 0) {
    return null;
  }

  const order = orders[0];

  const [items] = await connection.execute(
    `
    SELECT
      id,
      order_id,
      product_id,
      variant_id,
      quantity
    FROM order_items
    WHERE order_id = ?
    FOR UPDATE
    `,
    [order.id]
  );

  order.items = items;

  return order;
};

/*
|--------------------------------------------------------------------------
| Restore Variant Stock
|--------------------------------------------------------------------------
*/

const restoreVariantStock = async (
  connection,
  variantId,
  quantity
) => {
  const [result] = await connection.execute(
    `
    UPDATE product_variants
    SET stock_quantity = stock_quantity + ?
    WHERE id = ?
    `,
    [quantity, variantId]
  );

  if (result.affectedRows !== 1) {
    throw new Error(
      `Failed to restore stock for variant ${variantId}`
    );
  }
};

/*
|--------------------------------------------------------------------------
| Cancel Customer Order
|--------------------------------------------------------------------------
*/

const cancelCustomerOrder = async (
  connection,
  orderId,
  customerId
) => {
  const [result] = await connection.execute(
    `
    UPDATE orders
    SET order_status = 'CANCELLED'
    WHERE id = ?
      AND customer_id = ?
      AND order_status IN (
        'PENDING',
        'CONFIRMED',
        'PROCESSING'
      )
    `,
    [orderId, customerId]
  );

  return result.affectedRows;
};

module.exports = {
  getCustomerCartItems,
  createOrder,
  createOrderItem,
  reduceVariantStock,
  clearCustomerCart,
  getCustomerOrders,
  getCustomerOrderById,

  // Cancellation
  getCustomerOrderForCancellation,
  restoreVariantStock,
  cancelCustomerOrder,
};