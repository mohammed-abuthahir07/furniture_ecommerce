const { pool } = require("../../config/database");

const createNotification = async ({
  type,
  title,
  message,
  referenceType = null,
  referenceId = null,
}) => {
  const [result] = await pool.execute(
    `
    INSERT INTO notifications (
      type,
      title,
      message,
      reference_type,
      reference_id
    )
    VALUES (?, ?, ?, ?, ?)
    `,
    [
      type,
      title,
      message,
      referenceType,
      referenceId,
    ]
  );

  return result.insertId;
};

const getAllNotifications = async () => {
  const [rows] = await pool.execute(`
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
    ORDER BY created_at DESC
  `);

  return rows;
};

const getUnreadNotifications = async () => {
  const [rows] = await pool.execute(`
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
    WHERE is_read = 0
    ORDER BY created_at DESC
  `);

  return rows;
};

const getUnreadNotificationCount = async () => {
  const [rows] = await pool.execute(`
    SELECT COUNT(*) AS unread_count
    FROM notifications
    WHERE is_read = 0
  `);

  return rows[0].unread_count;
};

const getNotificationById = async (id) => {
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
    `,
    [id]
  );

  return rows[0];
};

const markNotificationAsRead = async (id) => {
  const [result] = await pool.execute(
    `
    UPDATE notifications
    SET is_read = 1
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows;
};

const markAllNotificationsAsRead = async () => {
  const [result] = await pool.execute(`
    UPDATE notifications
    SET is_read = 1
    WHERE is_read = 0
  `);

  return result.affectedRows;
};

const deleteNotification = async (id) => {
  const [result] = await pool.execute(
    `
    DELETE FROM notifications
    WHERE id = ?
    `,
    [id]
  );

  return result.affectedRows;
};

module.exports = {
  createNotification,
  getAllNotifications,
  getUnreadNotifications,
  getUnreadNotificationCount,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
};