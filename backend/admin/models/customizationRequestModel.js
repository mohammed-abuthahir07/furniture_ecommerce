const { pool } = require("../../config/database");

/*
|--------------------------------------------------------------------------
| GET ALL CUSTOMIZATION REQUESTS
|--------------------------------------------------------------------------
*/

const getAllCustomizationRequests = async () => {
  const [rows] = await pool.execute(`
    SELECT
      r.id,

      r.customer_id,
      c.name AS customer_name,
      c.email AS customer_email,
      c.phone AS customer_phone,

      r.request_type,

      r.product_id,
      p.name AS product_name,
      p.main_image AS product_image,

      r.customer_requirement,
      r.customer_image,

      r.admin_reply,
      r.additional_cost,

      r.status,

      r.created_at,
      r.updated_at

    FROM product_customization_requests r

    INNER JOIN customers c
      ON r.customer_id = c.id

    LEFT JOIN products p
      ON r.product_id = p.id

    ORDER BY r.created_at DESC
  `);

  return rows;
};


/*
|--------------------------------------------------------------------------
| GET CUSTOMIZATION REQUEST BY ID
|--------------------------------------------------------------------------
*/

const getCustomizationRequestById = async (id) => {
  const [rows] = await pool.execute(
    `
    SELECT
      r.id,

      r.customer_id,
      c.name AS customer_name,
      c.email AS customer_email,
      c.phone AS customer_phone,
      c.status AS customer_status,

      r.request_type,

      r.product_id,
      p.name AS product_name,
      p.main_image AS product_image,
      p.selling_price AS product_price,

      r.customer_requirement,
      r.customer_image,

      r.admin_reply,
      r.additional_cost,

      r.status,

      r.created_at,
      r.updated_at

    FROM product_customization_requests r

    INNER JOIN customers c
      ON r.customer_id = c.id

    LEFT JOIN products p
      ON r.product_id = p.id

    WHERE r.id = ?
    `,
    [id]
  );

  return rows[0];
};


/*
|--------------------------------------------------------------------------
| GET REQUESTS BY STATUS
|--------------------------------------------------------------------------
*/

const getCustomizationRequestsByStatus = async (status) => {
  const [rows] = await pool.execute(
    `
    SELECT
      r.id,

      r.customer_id,
      c.name AS customer_name,
      c.email AS customer_email,

      r.request_type,

      r.product_id,
      p.name AS product_name,

      r.customer_requirement,
      r.customer_image,

      r.admin_reply,
      r.additional_cost,

      r.status,

      r.created_at,
      r.updated_at

    FROM product_customization_requests r

    INNER JOIN customers c
      ON r.customer_id = c.id

    LEFT JOIN products p
      ON r.product_id = p.id

    WHERE r.status = ?

    ORDER BY r.created_at DESC
    `,
    [status]
  );

  return rows;
};


/*
|--------------------------------------------------------------------------
| UPDATE STATUS
|--------------------------------------------------------------------------
*/

const updateCustomizationRequestStatus = async (
  id,
  status
) => {
  const [result] = await pool.execute(
    `
    UPDATE product_customization_requests
    SET
      status = ?
    WHERE id = ?
    `,
    [
      status,
      id
    ]
  );

  return result.affectedRows;
};


/*
|--------------------------------------------------------------------------
| ADMIN REPLY
|--------------------------------------------------------------------------
*/

const updateCustomizationRequestReply = async (
  id,
  adminReply,
  additionalCost
) => {
  const [result] = await pool.execute(
    `
    UPDATE product_customization_requests
    SET
      admin_reply = ?,
      additional_cost = ?,
      status = 'ADMIN_REPLIED'
    WHERE id = ?
    `,
    [
      adminReply,
      additionalCost,
      id
    ]
  );

  return result.affectedRows;
};


/*
|--------------------------------------------------------------------------
| DELETE REQUEST
|--------------------------------------------------------------------------
*/

const deleteCustomizationRequest = async (id) => {
  const [result] = await pool.execute(
    `
    DELETE FROM product_customization_requests
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows;
};


module.exports = {
  getAllCustomizationRequests,
  getCustomizationRequestById,
  getCustomizationRequestsByStatus,
  updateCustomizationRequestStatus,
  updateCustomizationRequestReply,
  deleteCustomizationRequest
};