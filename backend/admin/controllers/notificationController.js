const {
  getAllNotifications,
  getUnreadNotifications,
  getUnreadNotificationCount,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = require("../models/notificationModel");

const getNotifications = async (req, res) => {
  try {
    const notifications = await getAllNotifications();

    return res.status(200).json({
      success: true,
      message: "Notifications fetched successfully",
      notifications,
    });
  } catch (error) {
    console.error("Get notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};

const getUnread = async (req, res) => {
  try {
    const notifications = await getUnreadNotifications();

    return res.status(200).json({
      success: true,
      message: "Unread notifications fetched successfully",
      notifications,
    });
  } catch (error) {
    console.error("Get unread notifications error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch unread notifications",
    });
  }
};

const getUnreadCount = async (req, res) => {
  try {
    const unreadCount = await getUnreadNotificationCount();

    return res.status(200).json({
      success: true,
      unread_count: unreadCount,
    });
  } catch (error) {
    console.error("Get unread count error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch unread notification count",
    });
  }
};

const getNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await getNotificationById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Notification fetched successfully",
      notification,
    });
  } catch (error) {
    console.error("Get notification error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch notification",
    });
  }
};

const markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await getNotificationById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    if (notification.is_read === 1) {
      return res.status(200).json({
        success: true,
        message: "Notification is already marked as read",
      });
    }

    await markNotificationAsRead(id);

    return res.status(200).json({
      success: true,
      message: "Notification marked as read successfully",
    });
  } catch (error) {
    console.error("Mark notification as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark notification as read",
    });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    const updatedCount = await markAllNotificationsAsRead();

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read successfully",
      updated_count: updatedCount,
    });
  } catch (error) {
    console.error("Mark all notifications as read error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to mark all notifications as read",
    });
  }
};

const removeNotification = async (req, res) => {
  try {
    const { id } = req.params;

    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    const notification = await getNotificationById(id);

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    await deleteNotification(id);

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
  getNotifications,
  getUnread,
  getUnreadCount,
  getNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
};