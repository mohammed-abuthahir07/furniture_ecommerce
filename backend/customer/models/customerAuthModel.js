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
  password
}) => {
  const [result] = await pool.execute(
    `
    INSERT INTO customers (
      name,
      email,
      phone,
      password,
      status
    )
    VALUES (?, ?, ?, ?, 'ACTIVE')
    `,
    [
      name,
      email,
      phone || null,
      password
    ]
  );

  return result.insertId;
};


module.exports = {
  findCustomerByEmail,
  findCustomerById,
  createCustomer
};