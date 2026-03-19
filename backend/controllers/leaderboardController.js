// backend/controllers/leaderboardController.js
const User = require('../models/User');
const Workout = require('../models/Workout');
const Diet = require('../models/Diet');
const Task = require('../models/Task'); 

// @desc    Get leaderboard rankings
// @route   GET /api/leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    // 1. Fetch all users (in a real app, you'd paginate or limit this)
    const users = await User.find().select('-password'); 

    const leaderboardData = await Promise.all(users.map(async (user) => {
      // 2. Fetch all data for this specific user
      const workouts = await Workout.find({ user: user._id });
      const diets = await Diet.find({ user: user._id });
      const tasks = await Task.find({ user: user._id });

      // 3. Calculate Workout Points (Dynamically based on their target)
      let workoutPoints = 0;
      workouts.forEach(w => {
        workoutPoints += (w.points * w.completedDates.length);
      });

      // 4. Calculate Diet Points (5 pts per completion)
      let dietPoints = 0;
      diets.forEach(d => {
        dietPoints += (5 * d.completedDates.length);
      });

      // 5. Calculate Task Points (10 pts per completion)
      let taskPoints = 0;
      tasks.forEach(t => {
        taskPoints += (10 * t.completedDates.length);
      });

      // 6. Aggregate Total
      const totalPoints = workoutPoints + dietPoints + taskPoints;

      return {
        _id: user._id,
        name: user.name, // Assuming your User model has a 'name' field
        workoutPoints,
        dietPoints,
        taskPoints,
        totalPoints
      };
    }));

    // 7. Sort the array by totalPoints descending (highest first)
    leaderboardData.sort((a, b) => b.totalPoints - a.totalPoints);

    res.status(200).json(leaderboardData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to generate leaderboard' });
  }
};