const express = require("express");

const customerAuthMiddleware = require(
  "../../middleware/customerAuthMiddleware"
);

const {
  getMyNotifications,
  getMyUnreadNotifications,
  getMyUnreadCount,
  getMyNotificationById,
  markAsRead,
  markAllAsRead,
  deleteMyNotification,
} = require("../controllers/notificationController");

const router = express.Router();

// GET /api/customer/notifications
router.get(
  "/",
  customerAuthMiddleware,
  getMyNotifications
);

// GET /api/customer/notifications/unread
router.get(
  "/unread",
  customerAuthMiddleware,
  getMyUnreadNotifications
);

// GET /api/customer/notifications/unread-count
router.get(
  "/unread-count",
  customerAuthMiddleware,
  getMyUnreadCount
);

// PATCH /api/customer/notifications/read-all
// Keep this route before the /:id routes.
router.patch(
  "/read-all",
  customerAuthMiddleware,
  markAllAsRead
);

// GET /api/customer/notifications/:id
router.get(
  "/:id",
  customerAuthMiddleware,
  getMyNotificationById
);

// PATCH /api/customer/notifications/:id/read
router.patch(
  "/:id/read",
  customerAuthMiddleware,
  markAsRead
);

// DELETE /api/customer/notifications/:id
router.delete(
  "/:id",
  customerAuthMiddleware,
  deleteMyNotification
);

module.exports = router;