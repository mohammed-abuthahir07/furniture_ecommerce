const { pool } = require("../../config/database");


/*
|--------------------------------------------------------------------------
| FIND CUSTOMER BY EMAIL
|--------------------------------------------------------------------------
*/

const findCustomerByEmail = async (email) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      name,
      email,
      google_id,
      phone,
      password,
      status,
      created_at,
      updated_at
    FROM customers
    WHERE email = ?
    `,
    [email]
  );

  return rows[0];
};


/*
|--------------------------------------------------------------------------
| FIND CUSTOMER BY GOOGLE ID
|--------------------------------------------------------------------------
*/

const findCustomerByGoogleId = async (googleId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      name,
      email,
      google_id,
      phone,
      password,
      status,
      created_at,
      updated_at
    FROM customers
    WHERE google_id = ?
    `,
    [googleId]
  );

  return rows[0];
};


/*
|--------------------------------------------------------------------------
| FIND CUSTOMER BY ID
|--------------------------------------------------------------------------
*/

const findCustomerById = async (id) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      name,
      email,
      google_id,
      phone,
      status,
      created_at,
      updated_at
    FROM customers
    WHERE id = ?
    `,
    [id]
  );

  return rows[0];
};


/*
|--------------------------------------------------------------------------
| CREATE CUSTOMER
|--------------------------------------------------------------------------
*/

const createCustomer = async ({
  name,
  email,
  phone,
  password,
  google_id
}) => {
  const [result] = await pool.execute(
    `
    INSERT INTO customers (
      name,
      email,
      google_id,
      phone,
      password,
      status
    )
    VALUES (?, ?, ?, ?, ?, 'ACTIVE')
    `,
    [
      name,
      email,
      google_id || null,
      phone || null,
      password
    ]
  );

  return result.insertId;
};


/*
|--------------------------------------------------------------------------
| LINK GOOGLE ACCOUNT TO EXISTING CUSTOMER
|--------------------------------------------------------------------------
*/

const updateCustomerGoogleId = async (
  customerId,
  googleId
) => {
  const [result] = await pool.execute(
    `
    UPDATE customers
    SET
      google_id = ?
    WHERE id = ?
    `,
    [
      googleId,
      customerId
    ]
  );

  return result.affectedRows;
};


module.exports = {
  findCustomerByEmail,
  findCustomerByGoogleId,
  findCustomerById,
  createCustomer,
  updateCustomerGoogleId
};