const { pool } = require("../../config/database");


// ============================================================
// SALES REPORT
// ============================================================

const getSalesReport = async (from, to) => {
  const [rows] = await pool.execute(
    `
    SELECT
      o.id AS order_id,
      o.order_number,
      DATE_FORMAT(o.created_at, '%Y-%m-%d %H:%i:%s') AS order_date,

      o.customer_id,
      o.customer_name,
      o.customer_email,
      o.customer_phone,

      oi.product_id,
      oi.variant_id,
      oi.product_name,
      oi.variant_name,
      oi.color,

      oi.quantity,
      oi.unit_price,
      oi.subtotal AS item_subtotal,

      o.discount_amount,
      o.shipping_charge,
      o.total_amount,

      o.payment_method,
      o.payment_status,
      o.order_status

    FROM orders o

    INNER JOIN order_items oi
      ON o.id = oi.order_id

    WHERE DATE(o.created_at) BETWEEN ? AND ?

    ORDER BY o.created_at DESC, oi.id ASC
    `,
    [from, to]
  );

  return rows;
};


// ============================================================
// ORDERS REPORT
// ============================================================

const getOrdersReport = async (from, to) => {
  const [rows] = await pool.execute(
    `
    SELECT
      o.id,
      o.order_number,

      o.customer_id,
      o.customer_name,
      o.customer_email,
      o.customer_phone,

      o.shipping_city,
      o.shipping_state,
      o.shipping_pincode,

      o.subtotal,
      o.discount_amount,
      o.shipping_charge,
      o.total_amount,

      o.payment_method,
      o.payment_status,
      o.order_status,

      DATE_FORMAT(o.created_at, '%Y-%m-%d %H:%i:%s') AS order_date

    FROM orders o

    WHERE DATE(o.created_at) BETWEEN ? AND ?

    ORDER BY o.created_at DESC
    `,
    [from, to]
  );

  return rows;
};


// ============================================================
// PRODUCTS REPORT
// ============================================================

const getProductsReport = async (from, to) => {
  const [rows] = await pool.execute(
    `
    SELECT
      oi.product_id,
      oi.product_name,

      p.brand,
      c.id AS category_id,
      c.name AS category_name,

      SUM(
        CASE
          WHEN o.order_status != 'CANCELLED'
          THEN oi.quantity
          ELSE 0
        END
      ) AS total_quantity_sold,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN oi.subtotal
            ELSE 0
          END
        ),
        0
      ) AS total_sales,

      COUNT(
        DISTINCT CASE
          WHEN o.order_status != 'CANCELLED'
          THEN o.id
        END
      ) AS total_orders

    FROM order_items oi

    INNER JOIN orders o
      ON oi.order_id = o.id

    LEFT JOIN products p
      ON oi.product_id = p.id

    LEFT JOIN categories c
      ON p.category_id = c.id

    WHERE DATE(o.created_at) BETWEEN ? AND ?

    GROUP BY
      oi.product_id,
      oi.product_name,
      p.brand,
      c.id,
      c.name

    ORDER BY total_quantity_sold DESC
    `,
    [from, to]
  );

  return rows;
};


// ============================================================
// CUSTOMERS REPORT
// ============================================================

const getCustomersReport = async (from, to) => {
  const [rows] = await pool.execute(
    `
    SELECT
      o.customer_id,

      o.customer_name,
      o.customer_email,
      o.customer_phone,

      COUNT(
        DISTINCT o.id
      ) AS total_orders,

      COUNT(
        oi.id
      ) AS total_items_purchased,

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

    FROM orders o

    LEFT JOIN order_items oi
      ON o.id = oi.order_id

    WHERE DATE(o.created_at) BETWEEN ? AND ?

    GROUP BY
      o.customer_id,
      o.customer_name,
      o.customer_email,
      o.customer_phone

    ORDER BY total_amount_spent DESC
    `,
    [from, to]
  );

  return rows;
};


// ============================================================
// INVENTORY REPORT
// ============================================================

const getInventoryReport = async () => {
  const [rows] = await pool.execute(
    `
    SELECT
      pv.id AS variant_id,
      pv.product_id,

      p.name AS product_name,
      p.brand,

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

    ORDER BY
      pv.stock_quantity ASC,
      pv.updated_at DESC
    `
  );

  return rows;
};


// ============================================================
// PAYMENT REPORT
// ============================================================

const getPaymentsReport = async (from, to) => {
  const [rows] = await pool.execute(
    `
    SELECT
      o.id AS order_id,
      o.order_number,

      DATE_FORMAT(
        o.created_at,
        '%Y-%m-%d %H:%i:%s'
      ) AS order_date,

      o.customer_id,
      o.customer_name,
      o.customer_email,

      o.total_amount,

      o.payment_method,
      o.payment_status,

      o.order_status

    FROM orders o

    WHERE DATE(o.created_at) BETWEEN ? AND ?

    ORDER BY o.created_at DESC
    `,
    [from, to]
  );

  return rows;
};


// ============================================================
// CATEGORIES REPORT
// ============================================================

const getCategoriesReport = async (from, to) => {
  const [rows] = await pool.execute(
    `
    SELECT
      c.id AS category_id,
      c.name AS category_name,

      COUNT(
        DISTINCT CASE
          WHEN o.order_status != 'CANCELLED'
          THEN o.id
        END
      ) AS total_orders,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN oi.quantity
            ELSE 0
          END
        ),
        0
      ) AS total_quantity_sold,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN oi.subtotal
            ELSE 0
          END
        ),
        0
      ) AS total_sales

    FROM categories c

    LEFT JOIN products p
      ON c.id = p.category_id

    LEFT JOIN order_items oi
      ON p.id = oi.product_id

    LEFT JOIN orders o
      ON oi.order_id = o.id
      AND DATE(o.created_at) BETWEEN ? AND ?

    GROUP BY
      c.id,
      c.name

    ORDER BY total_sales DESC
    `,
    [from, to]
  );

  return rows;
};


module.exports = {
  getSalesReport,
  getOrdersReport,
  getProductsReport,
  getCustomersReport,
  getInventoryReport,
  getPaymentsReport,
  getCategoriesReport,
};