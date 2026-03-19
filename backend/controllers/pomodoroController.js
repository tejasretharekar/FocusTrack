// backend/controllers/pomodoroController.js
const Pomodoro = require('../models/Pomodoro');

// Log a completed focus session
exports.logSession = async (req, res) => {
  const { duration } = req.body;
  
  try {
    // Logic: Earn 1 point for every 5 minutes of uninterrupted focus
    const pointsEarned = Math.floor(duration / 5);

    const session = await Pomodoro.create({
      user: req.user.id,
      duration,
      pointsEarned
    });

    res.status(201).json(session);
  } catch (error) {
    res.status(500).json({ message: 'Error logging Pomodoro session' });
  }
};