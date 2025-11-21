const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res
        .status(401)
        .json({ error: "Access denied. No token provided." });
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
      // Make sure user._id exists
    if (!decoded._id) {
      // Agar JWT me _id nahi hai, id ko set kar do
      decoded._id = decoded.id || decoded.userId;
    }

    req.user = decoded; // Logged-in user info attach
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
