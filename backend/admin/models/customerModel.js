const { pool } = require("../../config/database");

// CREATE CUSTOMER
const createCustomer = async (customerData) => {
  const {
    name,
    email,
    phone,
    password,
  } = customerData;

  const [result] = await pool.execute(
    `
    INSERT INTO customers (
      name,
      email,
      phone,
      password
    )
    VALUES (?, ?, ?, ?)
    `,
    [
      name,
      email,
      phone || null,
      password,
    ]
  );

  return result.insertId;
};


// GET ALL CUSTOMERS
const getAllCustomers = async () => {
  const [rows] = await pool.execute(
    `
    SELECT
      c.id,
      c.name,
      c.email,
      c.phone,
      c.status,
      c.created_at,
      c.updated_at,

      COUNT(o.id) AS total_orders,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN o.total_amount
            ELSE 0
          END
        ),
        0
      ) AS total_amount_spent,

      MAX(o.created_at) AS last_order_date

    FROM customers c

    LEFT JOIN orders o
      ON c.id = o.customer_id

    GROUP BY
      c.id,
      c.name,
      c.email,
      c.phone,
      c.status,
      c.created_at,
      c.updated_at

    ORDER BY c.id DESC
    `
  );

  return rows;
};


// GET CUSTOMER BY ID
const getCustomerById = async (id) => {
  const [rows] = await pool.execute(
    `
    SELECT
      c.id,
      c.name,
      c.email,
      c.phone,
      c.status,
      c.created_at,
      c.updated_at,

      COUNT(o.id) AS total_orders,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN o.total_amount
            ELSE 0
          END
        ),
        0
      ) AS total_amount_spent,

      MAX(o.created_at) AS last_order_date

    FROM customers c

    LEFT JOIN orders o
      ON c.id = o.customer_id

    WHERE c.id = ?

    GROUP BY
      c.id,
      c.name,
      c.email,
      c.phone,
      c.status,
      c.created_at,
      c.updated_at
    `,
    [id]
  );

  return rows[0];
};


// UPDATE CUSTOMER
const updateCustomer = async (id, customerData) => {
  const {
    name,
    email,
    phone,
  } = customerData;

  const [result] = await pool.execute(
    `
    UPDATE customers
    SET
      name = ?,
      email = ?,
      phone = ?
    WHERE id = ?
    `,
    [
      name,
      email,
      phone || null,
      id,
    ]
  );

  return result.affectedRows;
};


// UPDATE CUSTOMER STATUS
const updateCustomerStatus = async (id, status) => {
  const [result] = await pool.execute(
    `
    UPDATE customers
    SET status = ?
    WHERE id = ?
    `,
    [
      status,
      id,
    ]
  );

  return result.affectedRows;
};


// DELETE CUSTOMER
const deleteCustomer = async (id) => {
  const [result] = await pool.execute(
    `
    DELETE FROM customers
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows;
};


// GET CUSTOMER ORDER HISTORY
const getCustomerOrders = async (customerId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      order_number,
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

    WHERE customer_id = ?

    ORDER BY created_at DESC
    `,
    [customerId]
  );

  return rows;
};


module.exports = {
  createCustomer,
  getAllCustomers,
  getCustomerById,
  updateCustomer,
  updateCustomerStatus,
  deleteCustomer,
  getCustomerOrders,
};