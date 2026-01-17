const express = require("express");
const router = express.Router();
const issueController = require("../controllers/issueController");
const uploadMiddleware = require("../middleware/uploadMiddleware"); // ✅ correct name

// ==========================
// Report a new issue (WITH IMAGE)
// ==========================
router.post(
  "/report",
  uploadMiddleware.single("image"), // ✅ THIS FIXES req.body undefined
  issueController.reportIssue
);

// Update issue status
router.put("/update/:id", issueController.updateStatus);

// Track a specific issue
router.get("/track/:id", issueController.trackIssue);

// Get all issues of a user
router.get("/my/:userId", issueController.getMyIssues);

// Analyze & Track (combined API)
router.post("/analyzeAndTrackIssue", issueController.analyzeAndTrackIssue);

module.exports = router;
