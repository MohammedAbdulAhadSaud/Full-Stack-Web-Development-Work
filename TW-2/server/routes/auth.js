const router = require("express").Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = require("../middleware/auth");

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
const send = (user, res, code = 200) =>
  res.status(code).json({
    token: signToken(user._id),
    user: { id: user._id, name: user.name, email: user.email },
  });

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email and password are required." });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    if (await User.findOne({ email: email.toLowerCase() }))
      return res.status(400).json({ message: "An account with this email already exists." });

    const user = await User.create({ name, email, password });
    send(user, res, 201);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: (email || "").toLowerCase() });
    if (!user || !(await user.matchPassword(password || "")))
      return res.status(401).json({ message: "Incorrect email or password." });
    send(user, res);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/auth/me
router.get("/me", protect, (req, res) =>
  res.json({ user: { id: req.user._id, name: req.user.name, email: req.user.email } })
);

module.exports = router;
