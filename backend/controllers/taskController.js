const Task = require("../models/Task");

// CREATE TASK
exports.createTask = async (req, res) => {
try {
const { title, description, projectId, assignedTo } = req.body;

const task = await Task.create({
  title,
  description,
  projectId,
  assignedTo,
  assignedBy: req.user._id,
  status: "todo"
});

res.status(201).json(task);


} catch (error) {
console.error(error);
res.status(500).json({ message: "Error creating task" });
}
};

// GET TASKS ASSIGNED TO LOGGED-IN EMPLOYEE
exports.getMyTasks = async (req, res) => {
try {


const tasks = await Task.find({ assignedTo: req.user._id })
  .populate("projectId", "title");

res.json(tasks);


} catch (error) {
console.error(error);
res.status(500).json({ message: "Error fetching tasks" });
}
};

// UPDATE TASK STATUS (EMPLOYEE)
exports.updateTaskStatus = async (req, res) => {
try {


const task = await Task.findById(req.params.id);

if (!task) {
  return res.status(404).json({ message: "Task not found" });
}

// Ensure only assigned employee can update
if (!task.assignedTo.includes(req.user._id)) {
  return res.status(403).json({ message: "Not allowed to update this task" });
}

task.status = req.body.status;

await task.save();

res.json(task);


} catch (error) {
console.error(error);
res.status(500).json({ message: "Server error while updating task" });
}
};

// GET ALL TASKS (ADMIN / MANAGER)
exports.getAllTasks = async (req, res) => {
try {


const tasks = await Task.find()
  .populate("assignedTo", "name")
  .populate("projectId", "title");

res.json(tasks);


} catch (error) {
console.error(error);
res.status(500).json({ message: "Error fetching tasks" });
}
};


exports.deleteTask = async (req, res) => {
try {

await Task.findByIdAndDelete(req.params.id);
res.json({ message: "Task deleted" });

} catch (error) {
console.error(error);
res.status(500).json({ message: "Error deleting task" });
}
};
