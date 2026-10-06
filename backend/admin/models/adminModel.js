const { pool } = require("../../config/database");

const findAdminByEmail = async (email) => {
  const [rows] = await pool.execute(
    `SELECT id, name, email, password, status, created_at, updated_at
     FROM admins
     WHERE email = ?`,
    [email]
  );

  return rows[0];
};

const findAdminById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT id, name, email, status, created_at, updated_at
     FROM admins
     WHERE id = ?`,
    [id]
  );

  return rows[0];
};

module.exports = {
  findAdminByEmail,
  findAdminById,
};