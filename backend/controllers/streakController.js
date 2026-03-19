// backend/controllers/streakController.js
const Streak = require('../models/Streak');

// Helper function to update streaks (Call this from other controllers)
exports.updateStreakHelper = async (userId, category) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize to midnight for accurate day comparison

  let streak = await Streak.findOne({ user: userId, category });

  // 1. If no streak exists, create the first one
  if (!streak) {
    await Streak.create({
      user: userId,
      category,
      currentStreak: 1,
      highestStreak: 1,
      lastCompletedDate: today
    });
    return;
  }

  const lastDate = new Date(streak.lastCompletedDate);
  lastDate.setHours(0, 0, 0, 0);

  const diffTime = Math.abs(today - lastDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  // 2. Already updated today
  if (diffDays === 0) return;

  // 3. Updated yesterday -> Increment streak
  if (diffDays === 1) {
    streak.currentStreak += 1;
    if (streak.currentStreak > streak.highestStreak) {
      streak.highestStreak = streak.currentStreak;
    }
  } 
  // 4. Chain broken -> Reset streak
  else if (diffDays > 1) {
    streak.currentStreak = 1;
  }

  streak.lastCompletedDate = today;
  await streak.save();
};

// API Endpoint to get all streaks for the logged-in user
exports.getStreaks = async (req, res) => {
  try {
    const streaks = await Streak.find({ user: req.user.id });
    res.json(streaks);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching streaks' });
  }
};