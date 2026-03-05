const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { createProject, getProjects } = require("../controllers/projectController");

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  createProject
);

router.get(
  "/",
  protect,
  getProjects
);

module.exports = router;