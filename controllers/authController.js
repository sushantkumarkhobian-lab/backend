const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/email");

// ========================
// REGISTER
// ========================
exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const token = jwt.sign(
      { name, email, password: hashedPassword, role },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const verificationLink = `http://localhost:5000/api/auth/verify?token=${token}`;
    await sendEmail(email, verificationLink);

    res.json({ message: "Verification email sent. Check your inbox!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================
// EMAIL VERIFICATION
// ========================
exports.verifyEmail = async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(400).send("Token is missing");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const existingUser = await User.findOne({ email: decoded.email });
    if (existingUser) return res.status(400).send("User already verified");

    const newUser = new User({
      name: decoded.name,
      email: decoded.email,
      password: decoded.password,
      role: decoded.role
    });
    await newUser.save();

    res.send("Email verified! You can now log in.");
  } catch (err) {
    console.error(err);
    res.status(400).send("Invalid or expired token");
  }
};

// ========================
// LOGIN
// ========================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Incorrect password" });

    const loginToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token: loginToken,
      user: user.toJSON()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
