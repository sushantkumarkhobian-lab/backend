// controllers/issueController.js
const Issue = require("../models/Issue");

// ==========================
// REPORT ISSUE (WITH IMAGE)
// ==========================
const reportIssue = async (req, res) => {
  try {
    const { userId, description, category, location } = req.body;

    if (!userId || !description || !category || !location) {
      return res.status(400).json({
        message: "userId, description, category, and location are required"
      });
    }

    // Create new issue in MongoDB
    const newIssue = new Issue({
      userId,
      description,
      category,
      status: "submitted",
      location: typeof location === "string" ? JSON.parse(location) : location,
      image: req.file ? req.file.path : null, // ✅ IMAGE STORED HERE
    });

    await newIssue.save();

    res.status(201).json({
      message: "Issue reported successfully",
      issue: newIssue
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// UPDATE ISSUE STATUS
// ==========================
const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) return res.status(400).json({ message: "Status is required" });

    const issue = await Issue.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!issue) return res.status(404).json({ message: "Issue not found" });

    res.json({
      message: "Issue status updated successfully",
      issue
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// TRACK ISSUE
// ==========================
const trackIssue = async (req, res) => {
  try {
    const { id } = req.params;

    const issue = await Issue.findById(id);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    res.json({
      issueId: issue._id,
      status: issue.status,
      lastUpdated: issue.updatedAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// GET MY ISSUES
// ==========================
const getMyIssues = async (req, res) => {
  try {
    const { userId } = req.params;

    const issues = await Issue.find({ userId });

    res.json({
      userId,
      issues
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ==========================
// COMBINED API: Analyze & Track Issue
// ==========================
const analyzeAndTrackIssue = async (req, res) => {
  try {
    const { issueId } = req.body;
    if (!issueId) return res.status(400).json({ message: "Issue ID required" });

    const issue = await Issue.findById(issueId);
    if (!issue) return res.status(404).json({ message: "Issue not found" });

    const location = issue.location || { area: "", locality: "", pincode: "" };
    const status = issue.status;
    const description = issue.description || "";

    let detectedCategory = "Other";
    let department = "Municipal Office";
    let priority = "Low";

    if (description.toLowerCase().includes("pothole")) {
      detectedCategory = "Road";
      department = "Road Maintenance";
      priority = "High";
    } else if (description.toLowerCase().includes("garbage")) {
      detectedCategory = "Garbage";
      department = "Sanitation Department";
      priority = "Medium";
    } else if (description.toLowerCase().includes("water")) {
      detectedCategory = "Water Supply";
      department = "Water Department";
      priority = "High";
    } else if (description.toLowerCase().includes("streetlight")) {
      detectedCategory = "Streetlight";
      department = "Electricity Department";
      priority = "Medium";
    }

    res.json({
      issueId: issue._id,
      location,
      status,
      image: issue.image, // ✅ IMAGE PATH RETURNED
      aiAnalysis: {
        detectedCategory,
        assignedDepartment: department,
        priority
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  reportIssue,
  updateStatus,
  trackIssue,
  getMyIssues,
  analyzeAndTrackIssue
};
