const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["road", "water", "garbage", "streetlight", "sanitation", "other"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["submitted", "in progress", "resolved"],
      default: "submitted",
    },
    image: {
      type: String, // stores: uploads/filename.jpg
    },
    location: {
      area: String,
      locality: String,
      pincode: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema, "issues");
