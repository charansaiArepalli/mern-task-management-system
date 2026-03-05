const Task = require("../models/Task");

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
exports.getMyTasks = async (req, res) => {
  const tasks = await Task.find({ assignedTo: req.user._id });
  res.json(tasks);
  };
exports.updateTaskStatus = async (req, res) => {
  const { status } = req.body;

  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  // Only assigned employee can update
  if (task.assignedTo.toString() !== req.user._id.toString()) {
    return res.status(403).json({ message: "Not allowed" });
  }

  // Only allow valid status changes
  const validTransitions = {
    "todo": ["in-progress"],
    "in-progress": ["completed"],
    "completed": []
  };

  if (!validTransitions[task.status].includes(status)) {
    return res.status(400).json({ message: "Invalid status transition" });
  }

  task.status = status;
  await task.save();

  res.json(task);
};

exports.getAllTasks = async (req, res) => {

  const tasks = await Task.find()
    .populate("assignedTo", "name")
    .populate("projectId", "title");

  res.json(tasks);

};

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

  await Task.findByIdAndDelete(req.params.id);

  res.json({ message: "Task deleted" });

};