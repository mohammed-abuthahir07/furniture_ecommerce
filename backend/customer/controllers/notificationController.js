const {
  getCustomerNotifications,
  getCustomerUnreadNotifications,
  getCustomerUnreadCount,
  getCustomerNotificationById,
  markCustomerNotificationAsRead,
  markAllCustomerNotificationsAsRead,
  deleteCustomerNotification,
} = require("../models/notificationModel");


/*
|--------------------------------------------------------------------------
| GET ALL MY NOTIFICATIONS
|--------------------------------------------------------------------------
| GET /api/customer/notifications
|--------------------------------------------------------------------------
*/

const getMyNotifications = async (req, res) => {
  try {
    const customerId = req.customer.id;

    const notifications =
      await getCustomerNotifications(customerId);

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("Get customer notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET MY UNREAD NOTIFICATIONS
|--------------------------------------------------------------------------
| GET /api/customer/notifications/unread
|--------------------------------------------------------------------------
*/

const getMyUnreadNotifications = async (req, res) => {
  try {
    const customerId = req.customer.id;

    const notifications =
      await getCustomerUnreadNotifications(customerId);

    return res.status(200).json({
      success: true,
      count: notifications.length,
      data: notifications,
    });
  } catch (error) {
    console.error("Get unread notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch unread notifications",
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET MY UNREAD COUNT
|--------------------------------------------------------------------------
| GET /api/customer/notifications/unread-count
|--------------------------------------------------------------------------
*/

const getMyUnreadCount = async (req, res) => {
  try {
    const customerId = req.customer.id;

    const unreadCount =
      await getCustomerUnreadCount(customerId);

    return res.status(200).json({
      success: true,
      data: {
        unread_count: unreadCount,
      },
    });
  } catch (error) {
    console.error("Get unread count error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch unread count",
    });
  }
};


/*
|--------------------------------------------------------------------------
| GET ONE OF MY NOTIFICATIONS
|--------------------------------------------------------------------------
| GET /api/customer/notifications/:id
|--------------------------------------------------------------------------
*/

const getMyNotificationById = async (req, res) => {
  try {
    const customerId = req.customer.id;
    const notificationId = Number(req.params.id);

    if (
      !Number.isInteger(notificationId) ||
      notificationId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification =
      await getCustomerNotificationById(
        customerId,
        notificationId
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error("Get notification by ID error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notification",
    });
  }
};


/*
|--------------------------------------------------------------------------
| MARK ONE NOTIFICATION AS READ
|--------------------------------------------------------------------------
| PATCH /api/customer/notifications/:id/read
|--------------------------------------------------------------------------
*/

const markAsRead = async (req, res) => {
  try {
    const customerId = req.customer.id;
    const notificationId = Number(req.params.id);

    if (
      !Number.isInteger(notificationId) ||
      notificationId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    // Check ownership first. This also allows an already-read
    // notification to return a successful response.
    const notification =
      await getCustomerNotificationById(
        customerId,
        notificationId
      );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await markCustomerNotificationAsRead(
      customerId,
      notificationId
    );

    return res.status(200).json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};


/*
|--------------------------------------------------------------------------
| MARK ALL MY NOTIFICATIONS AS READ
|--------------------------------------------------------------------------
| PATCH /api/customer/notifications/read-all
|--------------------------------------------------------------------------
*/

const markAllAsRead = async (req, res) => {
  try {
    const customerId = req.customer.id;

    const updatedCount =
      await markAllCustomerNotificationsAsRead(
        customerId
      );

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      updated_count: updatedCount,
    });
  } catch (error) {
    console.error("Mark all as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
    });
  }
};


/*
|--------------------------------------------------------------------------
| DELETE ONE OF MY NOTIFICATIONS
|--------------------------------------------------------------------------
| DELETE /api/customer/notifications/:id
|--------------------------------------------------------------------------
*/

const deleteMyNotification = async (req, res) => {
  try {
    const customerId = req.customer.id;
    const notificationId = Number(req.params.id);

    if (
      !Number.isInteger(notificationId) ||
      notificationId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const deletedCount =
      await deleteCustomerNotification(
        customerId,
        notificationId
      );

    if (deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  } catch (error) {
    console.error("Delete notification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete notification",
    });
  }
};


module.exports = {
  getMyNotifications,
  getMyUnreadNotifications,
  getMyUnreadCount,
  getMyNotificationById,
  markAsRead,
  markAllAsRead,
  deleteMyNotification,
};