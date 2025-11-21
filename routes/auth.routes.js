const express = require("express");
const router = express.Router();
const { signup, login } = require("../services/auth.services");

// ===== SIGNUP ROUTE =====
router.post("/signup", async (req, res, next) => {
  try {
    const { fullname, email, password, username } = req.body;
    if (!fullname || !email || !password || !username) {
      res.status(400);
      return next(new Error("Name, email, username and password are required"));
    }

    const result = await signup({ fullname, email, password, username });
    res.status(201).json({ 
      success: true, 
      token: result.token, 
      user: result.user, 
      message: "Signup successful" 
    });
  } catch (err) {
    next({ status: err.statusCode || 500, message: err.message || "Server error" });
  }
});

// ===== LOGIN ROUTE =====
router.post("/login", async (req, res, next) => {
  try {
    const { emailOrusername, password } = req.body;

    if (!emailOrusername || !password) {
      res.status(400);
      return next(new Error("Email or username and password are required"));
    }

    const result = await login({ emailOrusername, password });
    res.json({ 
      success: true, 
      token: result.token, 
      user: result.user, 
      message: "Login successful" 
    });
  } catch (err) {
    next({ status: err.statusCode || 500, message: err.message || "Server error" });
  }
});

module.exports = router;
