const { pool } = require("../../config/database");

// ============================================================
// GET ALL CUSTOMERS
// ============================================================

const getAllCustomers = async () => {
  const [rows] = await pool.execute(`
    SELECT
      c.id,
      c.name,
      c.email,
      c.phone,
      c.status,
      c.created_at,
      c.updated_at,

      COUNT(o.id) AS total_orders,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN o.total_amount
            ELSE 0
          END
        ),
        0
      ) AS total_amount_spent,

      MAX(o.created_at) AS last_order_date

    FROM customers c

    LEFT JOIN orders o
      ON c.id = o.customer_id

    GROUP BY
      c.id,
      c.name,
      c.email,
      c.phone,
      c.status,
      c.created_at,
      c.updated_at

    ORDER BY c.id DESC
  `);

  return rows;
};


// ============================================================
// GET CUSTOMER COMPLETE DETAILS
// ============================================================

const getCustomerById = async (id) => {
  // ----------------------------------------------------------
  // CUSTOMER INFORMATION
  // ----------------------------------------------------------

  const [customerRows] = await pool.execute(
    `
    SELECT
      c.id,
      c.name,
      c.email,
      c.phone,
      c.status,
      c.created_at,
      c.updated_at,

      COUNT(o.id) AS total_orders,

      COALESCE(
        SUM(
          CASE
            WHEN o.order_status != 'CANCELLED'
            THEN o.total_amount
            ELSE 0
          END
        ),
        0
      ) AS total_amount_spent,

      MAX(o.created_at) AS last_order_date

    FROM customers c

    LEFT JOIN orders o
      ON c.id = o.customer_id

    WHERE c.id = ?

    GROUP BY
      c.id,
      c.name,
      c.email,
      c.phone,
      c.status,
      c.created_at,
      c.updated_at
    `,
    [id]
  );

  if (customerRows.length === 0) {
    return null;
  }

  const customer = customerRows[0];


  // ----------------------------------------------------------
  // CUSTOMER ORDERS
  // ----------------------------------------------------------

  const [orderRows] = await pool.execute(
    `
    SELECT
      o.id,
      o.order_number,
      o.customer_name,
      o.customer_email,
      o.customer_phone,

      o.shipping_address,
      o.shipping_city,
      o.shipping_state,
      o.shipping_pincode,

      o.subtotal,
      o.discount_amount,
      o.shipping_charge,
      o.total_amount,

      o.payment_method,
      o.payment_status,
      o.order_status,

      o.notes,

      o.created_at,
      o.updated_at

    FROM orders o

    WHERE o.customer_id = ?

    ORDER BY o.created_at DESC
    `,
    [id]
  );


  // ----------------------------------------------------------
  // GET PRODUCTS FOR EACH ORDER
  // ----------------------------------------------------------

  const orders = [];

  for (const order of orderRows) {
    const [itemRows] = await pool.execute(
      `
      SELECT
        oi.id,
        oi.order_id,

        oi.product_id,
        oi.variant_id,

        oi.product_name,
        oi.variant_name,
        oi.color,

        oi.quantity,
        oi.unit_price,
        oi.subtotal,

        p.main_image

      FROM order_items oi

      LEFT JOIN products p
        ON oi.product_id = p.id

      WHERE oi.order_id = ?

      ORDER BY oi.id ASC
      `,
      [order.id]
    );

    orders.push({
      ...order,
      items: itemRows,
    });
  }


  // ----------------------------------------------------------
  // FINAL CUSTOMER RESPONSE
  // ----------------------------------------------------------

  return {
    ...customer,
    orders,
  };
};


// ============================================================
// UPDATE CUSTOMER STATUS
// ============================================================

const deleteCustomerAccount = async (id) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [orders] = await connection.execute(
      "SELECT id FROM orders WHERE customer_id = ?",
      [id]
    );
    const orderIds = orders.map((order) => order.id);

    if (orderIds.length > 0) {
      const placeholders = orderIds.map(() => "?").join(", ");
      await connection.execute(
        `DELETE FROM order_items WHERE order_id IN (${placeholders})`,
        orderIds
      );
    }

    await connection.execute("DELETE FROM orders WHERE customer_id = ?", [id]);
    await connection.execute("DELETE FROM product_reviews WHERE customer_id = ?", [id]);
    await connection.execute("DELETE FROM customer_carts WHERE customer_id = ?", [id]);
    await connection.execute("DELETE FROM customer_wishlist WHERE customer_id = ?", [id]);
    await connection.execute("DELETE FROM notifications WHERE customer_id = ?", [id]);
    await connection.execute(
      "DELETE FROM product_customization_requests WHERE customer_id = ?",
      [id]
    );
    await connection.execute(
      "DELETE FROM custom_requirements WHERE customer_id = ?",
      [id]
    );
    await connection.execute(
      "DELETE FROM customer_password_otps WHERE customer_id = ?",
      [id]
    );

    const [result] = await connection.execute(
      "DELETE FROM customers WHERE id = ?",
      [id]
    );

    await connection.commit();
    return result.affectedRows;
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};


const updateCustomerStatus = async (id, status) => {
  const [result] = await pool.execute(
    `
    UPDATE customers
    SET status = ?
    WHERE id = ?
    `,
    [status, id]
  );

  return result.affectedRows;
};


// ============================================================
// EXPORT
// ============================================================

module.exports = {
  getAllCustomers,
  getCustomerById,
  updateCustomerStatus,
  deleteCustomerAccount,
};