const { pool } = require("../../config/database");

/*
|--------------------------------------------------------------------------
| CREATE CUSTOMER NOTIFICATION
|--------------------------------------------------------------------------
| The connection parameter lets order placement insert the notification
| inside the same transaction as the order.
|--------------------------------------------------------------------------
*/

const createCustomerNotification = async (
  connection,
  notificationData
) => {
  const {
    customer_id,
    type,
    title,
    message,
    reference_type = null,
    reference_id = null,
  } = notificationData;

  const [result] = await connection.execute(
    `
    INSERT INTO notifications (
      customer_id,
      type,
      title,
      message,
      reference_type,
      reference_id,
      is_read
    )
    VALUES (?, ?, ?, ?, ?, ?, 0)
    `,
    [
      customer_id,
      type,
      title,
      message,
      reference_type,
      reference_id,
    ]
  );

  return result.insertId;
};


/*
|--------------------------------------------------------------------------
| GET ALL NOTIFICATIONS FOR LOGGED-IN CUSTOMER
|--------------------------------------------------------------------------
*/

const getCustomerNotifications = async (customerId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      type,
      title,
      message,
      reference_type,
      reference_id,
      is_read,
      created_at
    FROM notifications
    WHERE customer_id = ?
    ORDER BY created_at DESC, id DESC
    `,
    [customerId]
  );

  return rows;
};


/*
|--------------------------------------------------------------------------
| GET UNREAD NOTIFICATIONS
|--------------------------------------------------------------------------
*/

const getCustomerUnreadNotifications = async (customerId) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      type,
      title,
      message,
      reference_type,
      reference_id,
      is_read,
      created_at
    FROM notifications
    WHERE customer_id = ?
      AND is_read = 0
    ORDER BY created_at DESC, id DESC
    `,
    [customerId]
  );

  return rows;
};


/*
|--------------------------------------------------------------------------
| GET UNREAD NOTIFICATION COUNT
|--------------------------------------------------------------------------
*/

const getCustomerUnreadCount = async (customerId) => {
  const [rows] = await pool.execute(
    `
    SELECT COUNT(*) AS unread_count
    FROM notifications
    WHERE customer_id = ?
      AND is_read = 0
    `,
    [customerId]
  );

  return Number(rows[0].unread_count);
};


/*
|--------------------------------------------------------------------------
| GET ONE NOTIFICATION BELONGING TO CUSTOMER
|--------------------------------------------------------------------------
*/

const getCustomerNotificationById = async (
  customerId,
  notificationId
) => {
  const [rows] = await pool.execute(
    `
    SELECT
      id,
      type,
      title,
      message,
      reference_type,
      reference_id,
      is_read,
      created_at
    FROM notifications
    WHERE id = ?
      AND customer_id = ?
    LIMIT 1
    `,
    [notificationId, customerId]
  );

  return rows.length ? rows[0] : null;
};


/*
|--------------------------------------------------------------------------
| MARK ONE NOTIFICATION AS READ
|--------------------------------------------------------------------------
*/

const markCustomerNotificationAsRead = async (
  customerId,
  notificationId
) => {
  const [result] = await pool.execute(
    `
    UPDATE notifications
    SET is_read = 1
    WHERE id = ?
      AND customer_id = ?
    `,
    [notificationId, customerId]
  );

  return result.affectedRows;
};


/*
|--------------------------------------------------------------------------
| MARK ALL CUSTOMER NOTIFICATIONS AS READ
|--------------------------------------------------------------------------
*/

const markAllCustomerNotificationsAsRead = async (
  customerId
) => {
  const [result] = await pool.execute(
    `
    UPDATE notifications
    SET is_read = 1
    WHERE customer_id = ?
      AND is_read = 0
    `,
    [customerId]
  );

  return result.affectedRows;
};


/*
|--------------------------------------------------------------------------
| DELETE ONE CUSTOMER NOTIFICATION
|--------------------------------------------------------------------------
*/

const deleteCustomerNotification = async (
  customerId,
  notificationId
) => {
  const [result] = await pool.execute(
    `
    DELETE FROM notifications
    WHERE id = ?
      AND customer_id = ?
    `,
    [notificationId, customerId]
  );

  return result.affectedRows;
};


module.exports = {
  createCustomerNotification,
  getCustomerNotifications,
  getCustomerUnreadNotifications,
  getCustomerUnreadCount,
  getCustomerNotificationById,
  markCustomerNotificationAsRead,
  markAllCustomerNotificationsAsRead,
  deleteCustomerNotification,
};