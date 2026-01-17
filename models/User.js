const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {           // still required for login
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ["citizen", "authority", "admin"],
    default: "citizen"
  }
}, { timestamps: true });

// Transform _id to id when sending response
userSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.password; // don't send password
  }
});

module.exports = mongoose.model("User", userSchema, "users");

