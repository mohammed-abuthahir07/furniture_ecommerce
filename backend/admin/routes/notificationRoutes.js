const express = require("express");

const {
  getNotifications,
  getUnread,
  getUnreadCount,
  getNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
} = require("../controllers/notificationController");

const adminAuthMiddleware = require("../../middleware/adminAuthMiddleware");

const router = express.Router();

router.get(
  "/",
  adminAuthMiddleware,
  getNotifications
);

router.get(
  "/unread",
  adminAuthMiddleware,
  getUnread
);

router.get(
  "/unread-count",
  adminAuthMiddleware,
  getUnreadCount
);

router.get(
  "/:id",
  adminAuthMiddleware,
  getNotification
);

router.patch(
  "/:id/read",
  adminAuthMiddleware,
  markAsRead
);

router.patch(
  "/read-all",
  adminAuthMiddleware,
  markAllAsRead
);

router.delete(
  "/:id",
  adminAuthMiddleware,
  removeNotification
);

module.exports = router;