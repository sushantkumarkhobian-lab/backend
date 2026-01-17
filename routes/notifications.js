const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");

// Send a notification (for internal use, e.g., when issue status changes)
router.post("/send", notificationController.sendNotification);

// Get all notifications for a specific user
router.get("/user/:userId", notificationController.getUserNotifications);

// Mark a notification as read
router.put("/read/:notificationId", notificationController.markAsRead);

module.exports = router;
