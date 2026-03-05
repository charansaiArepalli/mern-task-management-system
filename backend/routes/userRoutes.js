const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

router.get("/employees", protect, async (req, res) => {
  const employees = await User.find({ role: "employee" }).select("name email");
  res.json(employees);
});

module.exports = router;