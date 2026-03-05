const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { createTask, getMyTasks, updateTaskStatus, getAllTasks, deleteTask} = require("../controllers/taskController");

router.post(
  "/",
  protect,
  authorizeRoles("manager"),
  createTask
);

router.get(
  "/",
  protect,
  authorizeRoles("manager", "admin"),
  getAllTasks
);

router.get(
  "/my-tasks",
  protect,
  authorizeRoles("employee"),
  getMyTasks
);

router.put(
  "/:id",
  protect,
  authorizeRoles("employee", "manager"),
  updateTaskStatus
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("manager"),
  deleteTask
);

module.exports = router;