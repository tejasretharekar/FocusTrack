// backend/controllers/adminController.js
const User = require('../models/User');
const Challenge = require('../models/Challenge');

// @desc    Get all users
// @route   GET /api/admin/users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users' });
  }
};

// @desc    Delete a user
// @route   DELETE /api/admin/users/:id
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    // Prevent admins from deleting themselves accidentally
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }

    await user.deleteOne();
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
};

// @desc    Get system-wide statistics
// @route   GET /api/admin/stats
exports.getSystemStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalChallenges = await Challenge.countDocuments();
    const activeChallenges = await Challenge.countDocuments({ status: 'active' });

    res.status(200).json({
      totalUsers,
      totalChallenges,
      activeChallenges
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch system stats' });
  }
};

// Add to backend/controllers/adminController.js

const Task = require('../models/Task');
const Workout = require('../models/Workout');
const Diet = require('../models/Diet');

// @desc    Get complete details of a specific user
// @route   GET /api/admin/users/:id/details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Fetch all associated data
    const tasks = await Task.find({ user: req.params.id });
    const workouts = await Workout.find({ user: req.params.id });
    const diets = await Diet.find({ user: req.params.id });
    const challenges = await Challenge.find({ 
      $or: [{ creator: req.params.id }, { opponent: req.params.id }] 
    });

    res.status(200).json({
      user,
      stats: {
        totalTasks: tasks.length,
        totalWorkouts: workouts.length,
        totalDietItems: diets.length,
        totalChallenges: challenges.length
      },
      tasks,
      workouts,
      diets,
      challenges
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch user details' });
  }
};