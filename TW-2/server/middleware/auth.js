const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protects routes: requires "Authorization: Bearer <token>"
module.exports = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.split(" ")[1] : null;
  if (!token) return res.status(401).json({ message: "Please log in to continue." });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");
    if (!req.user) return res.status(401).json({ message: "Account no longer exists." });
    next();
  } catch {
    res.status(401).json({ message: "Session expired. Please log in again." });
  }
};
