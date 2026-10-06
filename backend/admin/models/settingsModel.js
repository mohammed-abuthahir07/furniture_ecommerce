const { pool } = require("../../config/database");
const bcrypt = require("bcryptjs");

/*
|--------------------------------------------------------------------------
| ADMIN PROFILE
|--------------------------------------------------------------------------
*/

const getAdminProfile = async (adminId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      name,
      email,
      status,
      created_at,
      updated_at
    FROM admins
    WHERE id = ?
    `,
    [adminId]
  );

  return rows[0];
};

const getAdminByEmail = async (email) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      name,
      email,
      status
    FROM admins
    WHERE email = ?
    `,
    [email]
  );

  return rows[0];
};

const updateAdminProfile = async (
  adminId,
  name,
  email
) => {
  const [result] = await pool.execute(
    `
    UPDATE admins
    SET
      name = ?,
      email = ?
    WHERE id = ?
    `,
    [
      name,
      email,
      adminId,
    ]
  );

  return result.affectedRows;
};


/*
|--------------------------------------------------------------------------
| ADMIN PASSWORD
|--------------------------------------------------------------------------
*/

const getAdminPassword = async (adminId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      password
    FROM admins
    WHERE id = ?
    `,
    [adminId]
  );

  return rows[0];
};

const updateAdminPassword = async (
  adminId,
  newPassword
) => {
  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  const [result] = await pool.execute(
    `
    UPDATE admins
    SET
      password = ?
    WHERE id = ?
    `,
    [
      hashedPassword,
      adminId,
    ]
  );

  return result.affectedRows;
};


/*
|--------------------------------------------------------------------------
| SHIPPING / DELIVERY / PAYMENT SETTINGS
|--------------------------------------------------------------------------
*/

const getStoreSettings = async () => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      shipping_charge,
      free_shipping_threshold,
      default_delivery_days,
      cod_enabled,
      online_payment_enabled,
      created_at,
      updated_at
    FROM store_settings
    ORDER BY id ASC
    LIMIT 1
    `
  );

  return rows[0];
};

const createStoreSettings = async ({
  shipping_charge,
  free_shipping_threshold,
  default_delivery_days,
  cod_enabled,
  online_payment_enabled,
}) => {
  const [result] = await pool.execute(
    `
    INSERT INTO store_settings (
      shipping_charge,
      free_shipping_threshold,
      default_delivery_days,
      cod_enabled,
      online_payment_enabled
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      shipping_charge,
      free_shipping_threshold,
      default_delivery_days,
      cod_enabled,
      online_payment_enabled,
    ]
  );

  return result.insertId;
};

const updateStoreSettings = async ({
  id,
  shipping_charge,
  free_shipping_threshold,
  default_delivery_days,
  cod_enabled,
  online_payment_enabled,
}) => {
  const [result] = await pool.execute(
    `
    UPDATE store_settings
    SET
      shipping_charge = ?,
      free_shipping_threshold = ?,
      default_delivery_days = ?,
      cod_enabled = ?,
      online_payment_enabled = ?
    WHERE id = ?
    `,
    [
      shipping_charge,
      free_shipping_threshold,
      default_delivery_days,
      cod_enabled,
      online_payment_enabled,
      id,
    ]
  );

  return result.affectedRows;
};

module.exports = {
  getAdminProfile,
  getAdminByEmail,
  updateAdminProfile,

  getAdminPassword,
  updateAdminPassword,

  getStoreSettings,
  createStoreSettings,
  updateStoreSettings,
};