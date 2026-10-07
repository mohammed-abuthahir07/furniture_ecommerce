const { pool } = require("../../config/database");

// Get all active categories
const getActiveCategories = async () => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        name,
        description,
        image
      FROM categories
      WHERE status = 'ACTIVE'
      ORDER BY id DESC
    `
  );

  return rows;
};

// Get one active category by ID
const getActiveCategoryById = async (categoryId) => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        name,
        description,
        image
      FROM categories
      WHERE id = ?
        AND status = 'ACTIVE'
      LIMIT 1
    `,
    [categoryId]
  );

  return rows[0] || null;
};

module.exports = {
  getActiveCategories,
  getActiveCategoryById,
};