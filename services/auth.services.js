const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const JWT_SECRET = process.env.JWT_SECRET || "yourSecretKey";

// ===== Signup service =====
const signup = async ({ email, username, fullname, password }) => {
  if (!email || !username || !fullname || !password) {
    const error = new Error("All fields (email, username, fullname, password) are required");
    error.statusCode = 400;
    throw error;
  }

  // Check for duplicate email or username
  const existingUser = await User.findOne({ $or: [{ email }, { username }] });
  if (existingUser) {
    const error = new Error("User already exists with this email or username");
    error.statusCode = 400;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({
    email,
    username,
    fullname,
    password: hashedPassword,
  });

  await user.save();

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7h" });

  return { token, user };
};

// ===== Login service =====
const login = async ({ emailOrusername, password }) => {
  if (!emailOrusername || !password) {
    const error = new Error("Email or username and password are required");
    error.statusCode = 400;
    throw error;
  }

  // Find user by email or username
  const user = await User.findOne({
    $or: [{ email: emailOrusername }, { username: emailOrusername }],
  });

  if (!user) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid credentials");
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7h" });

  return { token, user };
};

module.exports = { signup, login };
