const { pool } = require("./database");

const ensureVariantImageTable = async () => {
  const [rows] = await pool.query(
    `
      SELECT 1
      FROM information_schema.TABLES
      WHERE TABLE_SCHEMA = DATABASE()
        AND TABLE_NAME = 'product_variant_images'
      LIMIT 1
    `
  );

  if (rows.length > 0) return;

  await pool.query(`
    CREATE TABLE product_variant_images (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT,
      variant_id INT UNSIGNED NOT NULL,
      image VARCHAR(255) NOT NULL,
      image_title VARCHAR(150) NULL,
      sort_order INT UNSIGNED NOT NULL DEFAULT 0,
      created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      KEY idx_variant_images_variant_sort (variant_id, sort_order),
      CONSTRAINT fk_variant_images_variant
        FOREIGN KEY (variant_id) REFERENCES product_variants (id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
  `);
};

module.exports = {
  ensureVariantImageTable,
};
