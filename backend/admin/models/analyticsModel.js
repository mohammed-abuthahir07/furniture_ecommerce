const { pool } = require("../../config/database");


// ============================================================
// ANALYTICS SUMMARY
// ============================================================

const getAnalyticsSummary = async (from, to) => {
  const [rows] = await pool.execute(
    `
    SELECT
      COUNT(DISTINCT o.id) AS total_orders,

      COUNT(
        DISTINCT CASE
          WHEN o.order_status != 'CANCELLED'
          THEN o.id
        END
      ) AS successful_orders,

      COUNT(
        DISTINCT CASE
          WHEN o.order_status = 'CANCELLED'
          THEN o.id
        END
      ) AS cancelled_orders,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN o.total_amount
            ELSE 0
          END
        ),
        0
      ) AS total_revenue,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN oi.quantity
            ELSE 0
          END
        ),
        0
      ) AS total_items_sold,

      COALESCE(
        AVG(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN o.total_amount
          END
        ),
        0
      ) AS average_order_value

    FROM orders o

    LEFT JOIN order_items oi
      ON o.id = oi.order_id

    WHERE DATE(o.created_at) BETWEEN ? AND ?
    `,
    [from, to]
  );

  return rows[0];
};


// ============================================================
// SALES TREND
// ============================================================

const getSalesAnalytics = async (from, to) => {
  const [rows] = await pool.execute(
    `
    SELECT
      DATE(o.created_at) AS sales_date,

      COUNT(DISTINCT o.id) AS total_orders,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN oi.quantity
            ELSE 0
          END
        ),
        0
      ) AS items_sold,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN oi.subtotal
            ELSE 0
          END
        ),
        0
      ) AS product_sales,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN o.discount_amount
            ELSE 0
          END
        ),
        0
      ) AS discounts,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN o.shipping_charge
            ELSE 0
          END
        ),
        0
      ) AS shipping_revenue,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN o.total_amount
            ELSE 0
          END
        ),
        0
      ) AS total_revenue

    FROM orders o

    INNER JOIN order_items oi
      ON o.id = oi.order_id

    WHERE DATE(o.created_at) BETWEEN ? AND ?

    GROUP BY DATE(o.created_at)

    ORDER BY sales_date ASC
    `,
    [from, to]
  );

  return rows;
};


// ============================================================
// REVENUE ANALYTICS
// ============================================================

const getRevenueAnalytics = async (from, to) => {
  const [rows] = await pool.execute(
    `
    SELECT
      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN o.subtotal
            ELSE 0
          END
        ),
        0
      ) AS gross_sales,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN o.discount_amount
            ELSE 0
          END
        ),
        0
      ) AS total_discounts,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN o.shipping_charge
            ELSE 0
          END
        ),
        0
      ) AS shipping_revenue,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status = 'CANCELLED'
            THEN o.total_amount
            ELSE 0
          END
        ),
        0
      ) AS cancelled_amount,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN o.total_amount
            ELSE 0
          END
        ),
        0
      ) AS net_revenue

    FROM orders o

    WHERE DATE(o.created_at) BETWEEN ? AND ?
    `,
    [from, to]
  );

  return rows[0];
};


// ============================================================
// ORDER ANALYTICS
// ============================================================

const getOrdersAnalytics = async (from, to) => {
  const [rows] = await pool.execute(
    `
    SELECT
      o.order_status,

      COUNT(*) AS total_orders,

      COALESCE(
        SUM(o.total_amount),
        0
      ) AS total_order_value

    FROM orders o

    WHERE DATE(o.created_at) BETWEEN ? AND ?

    GROUP BY o.order_status

    ORDER BY
      CASE o.order_status
        WHEN 'PENDING' THEN 1
        WHEN 'CONFIRMED' THEN 2
        WHEN 'PROCESSING' THEN 3
        WHEN 'SHIPPED' THEN 4
        WHEN 'OUT_FOR_DELIVERY' THEN 5
        WHEN 'DELIVERED' THEN 6
        WHEN 'CANCELLED' THEN 7
        ELSE 8
      END
    `,
    [from, to]
  );

  return rows;
};


// ============================================================
// PRODUCT ANALYTICS
// ============================================================

const getProductsAnalytics = async (from, to) => {
  const [rows] = await pool.execute(
    `
    SELECT
      COUNT(DISTINCT p.id) AS total_products,

      COUNT(
        DISTINCT CASE
          WHEN p.status = 'ACTIVE'
          THEN p.id
        END
      ) AS active_products,

      COUNT(
        DISTINCT CASE
          WHEN p.status = 'INACTIVE'
          THEN p.id
        END
      ) AS inactive_products,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN oi.quantity
            ELSE 0
          END
        ),
        0
      ) AS total_units_sold,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN oi.subtotal
            ELSE 0
          END
        ),
        0
      ) AS total_product_sales

    FROM products p

    LEFT JOIN order_items oi
      ON p.id = oi.product_id

    LEFT JOIN orders o
      ON oi.order_id = o.id
      AND DATE(o.created_at) BETWEEN ? AND ?
    `,
    [from, to]
  );

  return rows[0];
};


// ============================================================
// BEST SELLING PRODUCTS
// ============================================================

const getBestSellingProductsAnalytics = async (from, to) => {
  const [rows] = await pool.execute(
    `
    SELECT
      oi.product_id,
      oi.product_name,

      p.main_image,
      p.brand,

      c.name AS category_name,

      SUM(
        CASE
          WHEN o.order_status != 'CANCELLED'
          THEN oi.quantity
          ELSE 0
        END
      ) AS units_sold,

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
      p.main_image,
      p.brand,
      c.name

    HAVING units_sold > 0

    ORDER BY units_sold DESC, total_sales DESC

    LIMIT 10
    `,
    [from, to]
  );

  return rows;
};


// ============================================================
// CATEGORY ANALYTICS
// ============================================================

const getCategoriesAnalytics = async (from, to) => {
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
      ) AS units_sold,

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


// ============================================================
// CUSTOMER ANALYTICS
// ============================================================

const getCustomersAnalytics = async (from, to) => {
  const [rows] = await pool.execute(
    `
    SELECT

      COUNT(
        DISTINCT o.customer_id
      ) AS customers_with_orders,

      COUNT(
        DISTINCT CASE
          WHEN o.order_status != 'CANCELLED'
          THEN o.customer_id
        END
      ) AS active_buyers,

      COUNT(
        DISTINCT CASE
          WHEN customer_order_counts.total_orders > 1
          THEN o.customer_id
        END
      ) AS repeat_customers,

      COALESCE(
        AVG(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN o.total_amount
          END
        ),
        0
      ) AS average_customer_order_value,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN o.total_amount
            ELSE 0
          END
        ),
        0
      ) AS customer_revenue

    FROM orders o

    LEFT JOIN (
      SELECT
        customer_id,
        COUNT(*) AS total_orders
      FROM orders
      WHERE order_status != 'CANCELLED'
      GROUP BY customer_id
    ) customer_order_counts
      ON o.customer_id = customer_order_counts.customer_id

    WHERE DATE(o.created_at) BETWEEN ? AND ?
    `,
    [from, to]
  );

  return rows[0];
};


// ============================================================
// PAYMENT ANALYTICS
// ============================================================

const getPaymentsAnalytics = async (from, to) => {
  const [rows] = await pool.execute(
    `
    SELECT
      payment_method,
      payment_status,

      COUNT(*) AS total_orders,

      COALESCE(
        SUM(total_amount),
        0
      ) AS total_amount

    FROM orders

    WHERE DATE(created_at) BETWEEN ? AND ?

    GROUP BY
      payment_method,
      payment_status

    ORDER BY
      payment_method,
      payment_status
    `,
    [from, to]
  );

  return rows;
};


// ============================================================
// INVENTORY ANALYTICS
// ============================================================

const getInventoryAnalytics = async () => {
  const [rows] = await pool.execute(
    `
    SELECT

      COUNT(*) AS total_variants,

      COALESCE(
        SUM(stock_quantity),
        0
      ) AS total_stock_quantity,

      SUM(
        CASE
          WHEN status = 'ACTIVE'
               AND stock_quantity > 5
          THEN 1
          ELSE 0
        END
      ) AS available_variants,

      SUM(
        CASE
          WHEN status = 'ACTIVE'
               AND stock_quantity BETWEEN 1 AND 5
          THEN 1
          ELSE 0
        END
      ) AS low_stock_variants,

      SUM(
        CASE
          WHEN status = 'ACTIVE'
               AND stock_quantity = 0
          THEN 1
          ELSE 0
        END
      ) AS sold_out_variants,

      SUM(
        CASE
          WHEN status = 'INACTIVE'
          THEN 1
          ELSE 0
        END
      ) AS inactive_variants

    FROM product_variants
    `
  );

  return rows[0];
};


// ============================================================
// BEST SELLING CATEGORIES
// ============================================================

const getBestSellingCategoriesAnalytics = async (from, to) => {
  const [rows] = await pool.execute(
    `
    SELECT
      c.id AS category_id,
      c.name AS category_name,

      SUM(
        CASE
          WHEN o.order_status != 'CANCELLED'
          THEN oi.quantity
          ELSE 0
        END
      ) AS units_sold,

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

    FROM categories c

    INNER JOIN products p
      ON c.id = p.category_id

    INNER JOIN order_items oi
      ON p.id = oi.product_id

    INNER JOIN orders o
      ON oi.order_id = o.id

    WHERE DATE(o.created_at) BETWEEN ? AND ?

    GROUP BY
      c.id,
      c.name

    HAVING units_sold > 0

    ORDER BY
      units_sold DESC,
      total_sales DESC

    LIMIT 10
    `,
    [from, to]
  );

  return rows;
};


module.exports = {
  getAnalyticsSummary,
  getSalesAnalytics,
  getRevenueAnalytics,
  getOrdersAnalytics,
  getProductsAnalytics,
  getBestSellingProductsAnalytics,
  getCategoriesAnalytics,
  getCustomersAnalytics,
  getPaymentsAnalytics,
  getInventoryAnalytics,
  getBestSellingCategoriesAnalytics,
};