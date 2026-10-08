const { pool } = require("../../config/database");

// =====================================================
// DASHBOARD SUMMARY
// =====================================================
const getDashboardSummary = async () => {
  const [rows] = await pool.execute(`
    SELECT
      (SELECT COUNT(*)
       FROM orders) AS total_orders,

      (SELECT COUNT(*)
       FROM orders
       WHERE order_status = 'PENDING') AS pending_orders,

      (SELECT COUNT(*)
       FROM orders
       WHERE order_status = 'PROCESSING') AS processing_orders,

      (SELECT COUNT(*)
       FROM orders
       WHERE order_status = 'DELIVERED') AS delivered_orders,

      (SELECT COUNT(*)
       FROM orders
       WHERE order_status = 'CANCELLED') AS cancelled_orders,

      (SELECT COUNT(*)
       FROM products
       WHERE status = 'ACTIVE') AS active_products,

      (SELECT COUNT(*)
       FROM products
       WHERE status = 'INACTIVE') AS inactive_products,

      (SELECT COUNT(*)
       FROM categories
       WHERE status = 'ACTIVE') AS active_categories,

      (SELECT COUNT(*)
       FROM product_variants
       WHERE status = 'ACTIVE'
       AND stock_quantity = 0) AS out_of_stock_variants,

      (SELECT COUNT(*)
       FROM customers) AS total_customers
  `);

  return rows[0];
};


// =====================================================
// ORDER STATUS SUMMARY
// =====================================================
const getOrderStatusSummary = async () => {
  const [rows] = await pool.execute(`
    SELECT
      order_status,
      COUNT(*) AS total_orders
    FROM orders
    GROUP BY order_status
    ORDER BY
      CASE order_status
        WHEN 'PENDING' THEN 1
        WHEN 'CONFIRMED' THEN 2
        WHEN 'PROCESSING' THEN 3
        WHEN 'SHIPPED' THEN 4
        WHEN 'OUT_FOR_DELIVERY' THEN 5
        WHEN 'DELIVERED' THEN 6
        WHEN 'CANCELLED' THEN 7
        ELSE 8
      END
  `);

  return rows;
};


// =====================================================
// REVENUE SUMMARY
// =====================================================
const getRevenueSummary = async () => {
  const [rows] = await pool.execute(`
    SELECT
      COALESCE(
        SUM(
          CASE
            WHEN order_status != 'CANCELLED'
            THEN total_amount
            ELSE 0
          END
        ),
        0
      ) AS total_revenue,

      COALESCE(
        SUM(
          CASE
            WHEN created_at >= CURDATE()
            AND created_at < CURDATE() + INTERVAL 1 DAY
            AND order_status != 'CANCELLED'
            THEN total_amount
            ELSE 0
          END
        ),
        0
      ) AS today_revenue,

      COALESCE(
        SUM(
          CASE
            WHEN created_at >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
            AND created_at < DATE_FORMAT(CURDATE(), '%Y-%m-01') + INTERVAL 1 MONTH
            AND order_status != 'CANCELLED'
            THEN total_amount
            ELSE 0
          END
        ),
        0
      ) AS this_month_revenue,

      COALESCE(
        SUM(
          CASE
            WHEN created_at >= DATE_FORMAT(CURDATE(), '%Y-01-01')
            AND created_at < DATE_FORMAT(CURDATE(), '%Y-01-01') + INTERVAL 1 YEAR
            AND order_status != 'CANCELLED'
            THEN total_amount
            ELSE 0
          END
        ),
        0
      ) AS this_year_revenue
    FROM orders
  `);

  return rows[0];
};


// =====================================================
// TODAY SUMMARY
// =====================================================
const getTodaySummary = async () => {
  const [rows] = await pool.execute(`
    SELECT
      (
        SELECT COUNT(*)
        FROM orders
        WHERE created_at >= CURDATE()
          AND created_at < CURDATE() + INTERVAL 1 DAY
      ) AS today_orders,

      (
        SELECT COALESCE(SUM(total_amount), 0)
        FROM orders
        WHERE created_at >= CURDATE()
          AND created_at < CURDATE() + INTERVAL 1 DAY
          AND order_status != 'CANCELLED'
      ) AS today_revenue,

      (
        SELECT COUNT(*)
        FROM products
        WHERE created_at >= CURDATE()
          AND created_at < CURDATE() + INTERVAL 1 DAY
      ) AS products_added_today,

      (
        SELECT COUNT(*)
        FROM product_variants
        WHERE created_at >= CURDATE()
          AND created_at < CURDATE() + INTERVAL 1 DAY
      ) AS variants_added_today,

      (
        SELECT COUNT(*)
        FROM orders
        WHERE created_at >= CURDATE()
          AND created_at < CURDATE() + INTERVAL 1 DAY
          AND order_status = 'DELIVERED'
      ) AS delivered_today,

      (
        SELECT COUNT(*)
        FROM orders
        WHERE created_at >= CURDATE()
          AND created_at < CURDATE() + INTERVAL 1 DAY
          AND order_status = 'CANCELLED'
      ) AS cancelled_today
  `);

  return rows[0];
};


// =====================================================
// LOW STOCK VARIANTS
// =====================================================
// Low stock = 1 to 5
// =====================================================
const getLowStockVariants = async () => {
  const [rows] = await pool.execute(`
    SELECT
      pv.id,
      pv.product_id,
      p.name AS product_name,
      p.main_image,
      pv.variant_name,
      pv.color,
      pv.stock_quantity,
      pv.status
    FROM product_variants pv
    INNER JOIN products p
      ON pv.product_id = p.id
    WHERE pv.status = 'ACTIVE'
      AND pv.stock_quantity > 0
      AND pv.stock_quantity <= 5
    ORDER BY pv.stock_quantity ASC, pv.updated_at DESC
    LIMIT 20
  `);

  return rows;
};


// =====================================================
// OUT OF STOCK VARIANTS
// =====================================================
const getOutOfStockVariants = async () => {
  const [rows] = await pool.execute(`
    SELECT
      pv.id,
      pv.product_id,
      p.name AS product_name,
      p.main_image,
      pv.variant_name,
      pv.color,
      pv.stock_quantity,
      pv.status
    FROM product_variants pv
    INNER JOIN products p
      ON pv.product_id = p.id
    WHERE pv.status = 'ACTIVE'
      AND pv.stock_quantity = 0
    ORDER BY pv.updated_at DESC
    LIMIT 20
  `);

  return rows;
};


// =====================================================
// RECENT ORDERS
// =====================================================
const getRecentOrders = async () => {
  const [rows] = await pool.execute(`
    SELECT
      id,
      order_number,
      customer_name,
      customer_email,
      total_amount,
      payment_method,
      payment_status,
      order_status,
      created_at
    FROM orders
    ORDER BY created_at DESC
    LIMIT 10
  `);

  return rows;
};


// =====================================================
// RECENT PRODUCTS
// =====================================================
const getRecentProducts = async () => {
  const [rows] = await pool.execute(`
    SELECT
      p.id,
      p.name,
      p.brand,
      p.main_image,
      p.mrp,
      p.selling_price,
      p.status,
      c.name AS category_name,
      p.created_at
    FROM products p
    INNER JOIN categories c
      ON p.category_id = c.id
    ORDER BY p.created_at DESC
    LIMIT 10
  `);

  return rows;
};


// =====================================================
// BEST SELLING PRODUCTS
// =====================================================
const getBestSellingProducts = async () => {
  const [rows] = await pool.execute(`
    SELECT
      oi.product_id,
      oi.product_name,
      SUM(oi.quantity) AS total_quantity_sold,
      SUM(oi.subtotal) AS total_sales
    FROM order_items oi
    INNER JOIN orders o
      ON oi.order_id = o.id
    WHERE o.order_status != 'CANCELLED'
    GROUP BY
      oi.product_id,
      oi.product_name
    ORDER BY total_quantity_sold DESC
    LIMIT 10
  `);

  return rows;
};


module.exports = {
  getDashboardSummary,
  getOrderStatusSummary,
  getRevenueSummary,
  getTodaySummary,
  getLowStockVariants,
  getOutOfStockVariants,
  getRecentOrders,
  getRecentProducts,
  getBestSellingProducts,
};