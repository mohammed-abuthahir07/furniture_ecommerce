const { pool } = require("../../config/database");

// CREATE CATEGORY
const createCategory = async (categoryData) => {
  const { name, description, image } = categoryData;

  const [result] = await pool.execute(
    `INSERT INTO categories (name, description, image)
     VALUES (?, ?, ?)`,
    [name, description || null, image || null]
  );

  return result.insertId;
};


// GET ALL CATEGORIES
const getAllCategories = async () => {
  const [rows] = await pool.execute(
    `SELECT id, name, description, image, status, created_at, updated_at
     FROM categories
     ORDER BY id DESC`
  );

  return rows;
};


// GET CATEGORY BY ID
const getCategoryById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, name, description, image, status, created_at, updated_at
     FROM categories
     WHERE id = ?`,
    [id]
  );

  return rows[0];
};


// UPDATE CATEGORY
const updateCategory = async (id, categoryData) => {
  const { name, description, image } = categoryData;

  const [result] = await pool.execute(
    `UPDATE categories
     SET name = ?,
         description = ?,
         image = ?
     WHERE id = ?`,
    [
      name,
      description || null,
      image || null,
      id,
    ]
  );

  return result.affectedRows;
};


// UPDATE CATEGORY STATUS
const updateCategoryStatus = async (id, status) => {
  const [result] = await pool.execute(
    `UPDATE categories
     SET status = ?
     WHERE id = ?`,
    [status, id]
  );

  return result.affectedRows;
};


// DELETE CATEGORY
const deleteCategory = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM categories
     WHERE id = ?`,
    [id]
  );

  return result.affectedRows;
};


module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  updateCategoryStatus,
  deleteCategory,
};