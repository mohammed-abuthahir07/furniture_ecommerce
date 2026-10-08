const { pool } = require("./database");

const INDEXES = [
  {
    table: "notifications",
    name: "idx_notifications_customer_created",
    sql: "CREATE INDEX idx_notifications_customer_created ON notifications (customer_id, created_at)",
  },
  {
    table: "products",
    name: "idx_products_status_id",
    sql: "CREATE INDEX idx_products_status_id ON products (status, id)",
  },
  {
    table: "product_variants",
    name: "idx_variants_status_stock",
    sql: "CREATE INDEX idx_variants_status_stock ON product_variants (status, stock_quantity)",
  },
];

const ensurePerformanceIndexes = async () => {
  for (const index of INDEXES) {
    const [rows] = await pool.query(
      `
        SELECT 1
        FROM information_schema.STATISTICS
        WHERE TABLE_SCHEMA = DATABASE()
          AND TABLE_NAME = ?
          AND INDEX_NAME = ?
        LIMIT 1
      `,
      [index.table, index.name]
    );

    if (rows.length === 0) {
      await pool.query(index.sql);
    }
  }
};

module.exports = {
  ensurePerformanceIndexes,
};
