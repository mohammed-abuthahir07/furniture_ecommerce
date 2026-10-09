const { pool } = require("../../config/database");


/*
|--------------------------------------------------------------------------
| Find Product
|--------------------------------------------------------------------------
*/

const findProductById = async (productId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      name,
      main_image,
      status
    FROM products
    WHERE id = ?
    `,
    [productId]
  );

  return rows[0];
};


/*
|--------------------------------------------------------------------------
| Create Customization Request
|--------------------------------------------------------------------------
*/

const createCustomizationRequest = async ({
  customerId,
  requestType,
  productId,
  customerRequirement,
  customerImage
}) => {
  const [result] = await pool.execute(
    `
    INSERT INTO product_customization_requests (
      customer_id,
      request_type,
      product_id,
      customer_requirement,
      customer_image,
      status
    )
    VALUES (?, ?, ?, ?, ?, 'PENDING')
    `,
    [
      customerId,
      requestType,
      productId,
      customerRequirement,
      customerImage
    ]
  );

  return result.insertId;
};


/*
|--------------------------------------------------------------------------
| Get Customer Requests
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Customer can see only their own requests.
|
| The customer can see the studio status, reply, and quote.
|
|--------------------------------------------------------------------------
*/

const getCustomerCustomizationRequests = async (
  customerId
) => {
  const [rows] = await pool.execute(
    `
    SELECT
      r.id,
      r.customer_id,
      r.request_type,
      r.product_id,

      p.name AS product_name,
      p.main_image AS product_image,

      r.customer_requirement,
      r.customer_image,

      r.status,
      r.admin_reply,
      r.additional_cost,

      r.created_at,
      r.updated_at

    FROM product_customization_requests r

    LEFT JOIN products p
      ON p.id = r.product_id

    WHERE r.customer_id = ?

    ORDER BY r.created_at DESC
    `,
    [customerId]
  );

  return rows;
};


/*
|--------------------------------------------------------------------------
| Get One Customer Request
|--------------------------------------------------------------------------
|
| IMPORTANT:
| Only the owner can access this request.
|
| The customer can see the studio status, reply, and quote.
|
|--------------------------------------------------------------------------
*/

const getCustomerCustomizationRequestById = async (
  customerId,
  requestId
) => {
  const [rows] = await pool.execute(
    `
    SELECT
      r.id,
      r.customer_id,
      r.request_type,
      r.product_id,

      p.name AS product_name,
      p.main_image AS product_image,

      r.customer_requirement,
      r.customer_image,

      r.status,
      r.admin_reply,
      r.additional_cost,

      r.created_at,
      r.updated_at

    FROM product_customization_requests r

    LEFT JOIN products p
      ON p.id = r.product_id

    WHERE r.id = ?
      AND r.customer_id = ?
    `,
    [requestId, customerId]
  );

  return rows[0];
};


/*
|--------------------------------------------------------------------------
| Update Customer Request
|--------------------------------------------------------------------------
|
| Customer can update:
| - customer_requirement
| - customer_image
|
| Customer CANNOT update:
| - customer_id
| - request_type
| - product_id
| - status
| - admin_reply
| - additional_cost
|
|--------------------------------------------------------------------------
*/

const updateCustomerCustomizationRequest = async ({
  customerId,
  requestId,
  customerRequirement,
  customerImage
}) => {
  const [result] = await pool.execute(
    `
    UPDATE product_customization_requests
    SET
      customer_requirement = ?,
      customer_image = ?
    WHERE id = ?
      AND customer_id = ?
      AND status = 'PENDING'
    `,
    [
      customerRequirement,
      customerImage,
      requestId,
      customerId
    ]
  );

  return result.affectedRows;
};


module.exports = {
  findProductById,
  createCustomizationRequest,
  getCustomerCustomizationRequests,
  getCustomerCustomizationRequestById,
  updateCustomerCustomizationRequest
};