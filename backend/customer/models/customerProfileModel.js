const { pool } = require("../../config/database");

const getCustomerProfileById = async (customerId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      name,
      email,
      google_id,
      phone,
      profile_image,
      status,
      created_at,
      updated_at
    FROM customers
    WHERE id = ?
    `,
    [customerId]
  );

  return rows[0];
};

const updateCustomerProfile = async ({
  customerId,
  name,
  phone,
  profileImage
}) => {
  const [result] = await pool.execute(
    `
    UPDATE customers
    SET
      name = ?,
      phone = ?,
      profile_image = ?
    WHERE id = ?
    `,
    [
      name,
      phone,
      profileImage,
      customerId
    ]
  );

  return result.affectedRows;
};

module.exports = {
  getCustomerProfileById,
  updateCustomerProfile
};