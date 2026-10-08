const { pool } = require("../../config/database");

const createCustomRequirement = async (requirementData) => {
  const {
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
  } = requirementData;

  const [result] = await pool.execute(
    `
      INSERT INTO custom_requirements (
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
        reference_image
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      customer_id || null,
      name,
      email || null,
      phone,
      address,
      city || null,
      state || null,
      pincode || null,
      alternative_address || null,
      requirement,
      reference_image || null,
    ]
  );

  return result.insertId;
};

const getCustomRequirements = async () => {
  const [rows] = await pool.execute(`
    SELECT
      cr.id,
      cr.customer_id,
      cr.name,
      cr.email,
      cr.phone,
      cr.address,
      cr.city,
      cr.state,
      cr.pincode,
      cr.alternative_address,
      cr.requirement,
      cr.reference_image,
      cr.created_at,
      cr.updated_at
    FROM custom_requirements cr
    ORDER BY cr.created_at DESC
  `);

  return rows;
};

const getCustomRequirementById = async (id) => {
  const [rows] = await pool.execute(
    `
      SELECT
        cr.id,
        cr.customer_id,
        cr.name,
        cr.email,
        cr.phone,
        cr.address,
        cr.city,
        cr.state,
        cr.pincode,
        cr.alternative_address,
        cr.requirement,
        cr.reference_image,
        cr.created_at,
        cr.updated_at
      FROM custom_requirements cr
      WHERE cr.id = ?
      LIMIT 1
    `,
    [id]
  );

  return rows[0] || null;
};

module.exports = {
  createCustomRequirement,
  getCustomRequirements,
  getCustomRequirementById,
};