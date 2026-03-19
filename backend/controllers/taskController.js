// backend/controllers/taskController.js
const Task = require('../models/Task');
const { updateStreakHelper } = require('./streakController');

// Get all tasks for logged-in user
exports.getTasks = async (req, res) => {
  const tasks = await Task.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(tasks);
};

// Create a new task
exports.createTask = async (req, res) => {
  const { title, type } = req.body;
  const task = await Task.create({
    user: req.user._id,
    title,
    type
  });
  res.status(201).json(task);
};

// Update task (mark complete)
exports.updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  
  if (!task || task.user.toString() !== req.user.id) {
    return res.status(404).json({ message: 'Task not found' });
  }
  
  task.isCompleted = !task.isCompleted; // Toggle completion
  await task.save();

  // STREAK LOGIC TRIGGER: If marked complete, update the Task streak!
  if (task.isCompleted) {
    await updateStreakHelper(req.user.id, 'tasks');
  }

  res.json(task);
};

// Delete task
exports.deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task || task.user.toString() !== req.user.id) {
    return res.status(404).json({ message: 'Task not found' });
  }
  await task.deleteOne();
  res.json({ message: 'Task removed' });
};