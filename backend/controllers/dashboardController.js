// backend/controllers/dashboardController.js
const Task = require('../models/Task');
const Workout = require('../models/Workout');
const Diet = require('../models/Diet');

// @desc    Get user dashboard statistics
// @route   GET /api/dashboard
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const today = new Date().toISOString().split('T')[0];

    // Fetch all user data
    const tasks = await Task.find({ user: userId });
    const workouts = await Workout.find({ user: userId });
    const diets = await Diet.find({ user: userId });

    // Helper function to safely count completions for today
    const countCompletedToday = (items) => {
      return items.filter(item => item.completedDates && item.completedDates.includes(today)).length;
    };

    // Aggregate the stats
    const stats = {
      tasks: {
        total: tasks.length,
        completedToday: countCompletedToday(tasks)
      },
      workouts: {
        total: workouts.length,
        completedToday: countCompletedToday(workouts)
      },
      diet: {
        total: diets.length,
        completedToday: countCompletedToday(diets)
      }
    };

    res.status(200).json(stats);
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Failed to generate dashboard statistics' });
  }
};