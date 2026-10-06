const { pool } = require("../../config/database");

// CREATE OFFER
const createOffer = async (offerData) => {
  const {
    title,
    description,
    image,
    discount_type,
    discount_value,
    start_date,
    end_date,
  } = offerData;

  const [result] = await pool.execute(
    `INSERT INTO offers (
      title,
      description,
      image,
      discount_type,
      discount_value,
      start_date,
      end_date
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      title,
      description || null,
      image || null,
      discount_type,
      discount_value,
      start_date,
      end_date,
    ]
  );

  return result.insertId;
};

// GET ALL OFFERS
const getAllOffers = async () => {
  const [rows] = await pool.execute(
    `SELECT
      id,
      title,
      description,
      image,
      discount_type,
      discount_value,
      start_date,
      end_date,
      status,
      created_at,
      updated_at
    FROM offers
    ORDER BY id DESC`
  );

  return rows;
};

// GET OFFER BY ID
const getOfferById = async (id) => {
  const [rows] = await pool.execute(
    `SELECT
      id,
      title,
      description,
      image,
      discount_type,
      discount_value,
      start_date,
      end_date,
      status,
      created_at,
      updated_at
    FROM offers
    WHERE id = ?`,
    [id]
  );

  return rows[0];
};

// UPDATE OFFER
const updateOffer = async (id, offerData) => {
  const {
    title,
    description,
    image,
    discount_type,
    discount_value,
    start_date,
    end_date,
  } = offerData;

  let query = `
    UPDATE offers
    SET
      title = ?,
      description = ?,
      discount_type = ?,
      discount_value = ?,
      start_date = ?,
      end_date = ?
  `;

  const values = [
    title,
    description || null,
    discount_type,
    discount_value,
    start_date,
    end_date,
  ];

  // Replace image only when a new image is uploaded
  if (image) {
    query += `, image = ?`;
    values.push(image);
  }

  query += ` WHERE id = ?`;

  values.push(id);

  const [result] = await pool.execute(query, values);

  return result.affectedRows;
};

// UPDATE OFFER STATUS
const updateOfferStatus = async (id, status) => {
  const [result] = await pool.execute(
    `UPDATE offers
     SET status = ?
     WHERE id = ?`,
    [status, id]
  );

  return result.affectedRows;
};

// DELETE OFFER
const deleteOffer = async (id) => {
  const [result] = await pool.execute(
    `DELETE FROM offers
     WHERE id = ?`,
    [id]
  );

  return result.affectedRows;
};

module.exports = {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
  updateOfferStatus,
  deleteOffer,
};