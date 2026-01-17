const Notification = require("../models/Notification");
const Issue = require("../models/Issue");

// Send a new notification
const sendNotification = async (req, res) => {
  try {
    const { issueId, message } = req.body;

    if (!issueId || !message) {
      return res.status(400).json({ message: "issueId and message are required" });
    }

    // Get the userId from the issue
    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const newNotification = new Notification({
      issueId,
      message,
      userId: issue.userId // link to user who reported
    });

    await newNotification.save();

    res.status(201).json({
      message: "Notification sent successfully",
      notification: newNotification
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all notifications for a user
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const notifications = await Notification.find({ userId }).sort({ timestamp: -1 });

    res.json({ userId, notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Optional: mark notification as read
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;

    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ message: "Notification not found" });

    res.json({ message: "Notification marked as read", notification });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { sendNotification, getUserNotifications, markAsRead };
