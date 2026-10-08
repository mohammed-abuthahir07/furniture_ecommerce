const { pool } = require("../../config/database");

// Get all custom requirements
const getAllCustomRequirements = async () => {
  const [rows] = await pool.execute(`
    SELECT
      id,
      customer_id,
      name,
      email,
      phone,
      address,
      city,
      state,
      pincode,
      alternative_address,
      requirement,
      reference_image,
      created_at,
      updated_at
    FROM custom_requirements
    ORDER BY created_at DESC
  `);

  return rows;
};

// Get one custom requirement by ID
const getCustomRequirementById = async (id) => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        customer_id,
        name,
        email,
        phone,
        address,
        city,
        state,
        pincode,
        alternative_address,
        requirement,
        reference_image,
        created_at,
        updated_at
      FROM custom_requirements
      WHERE id = ?
      LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
};

module.exports = {
  getAllCustomRequirements,
  getCustomRequirementById,
};