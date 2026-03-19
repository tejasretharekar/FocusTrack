// backend/models/Streak.js
const mongoose = require('mongoose');

const streakSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { 
    type: String, 
    enum: ['login', 'tasks', 'diet', 'workout'], 
    required: true 
  },
  currentStreak: { type: Number, default: 0 },
  highestStreak: { type: Number, default: 0 },
  lastCompletedDate: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Streak', streakSchema);