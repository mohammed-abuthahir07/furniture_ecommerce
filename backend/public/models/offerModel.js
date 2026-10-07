const { pool } = require("../../config/database");

// ======================================================
// GET CURRENT ACTIVE OFFERS
// ======================================================

const getActiveOffers = async () => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        title,
        description,
        image,
        discount_type,
        discount_value,
        start_date,
        end_date

      FROM offers

      WHERE status = 'ACTIVE'
        AND CURDATE() >= start_date
        AND CURDATE() <= end_date

      ORDER BY
        end_date ASC,
        id DESC
    `
  );

  return rows;
};

// ======================================================
// GET ONE CURRENT ACTIVE OFFER
// ======================================================

const getActiveOfferById = async (offerId) => {
  const [rows] = await pool.execute(
    `
      SELECT
        id,
        title,
        description,
        image,
        discount_type,
        discount_value,
        start_date,
        end_date

      FROM offers

      WHERE id = ?
        AND status = 'ACTIVE'
        AND CURDATE() >= start_date
        AND CURDATE() <= end_date

      LIMIT 1
    `,
    [offerId]
  );

  return rows[0] || null;
};

module.exports = {
  getActiveOffers,
  getActiveOfferById,
};