// backend/models/Pomodoro.js
const mongoose = require('mongoose');

const pomodoroSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  duration: { type: Number, required: true }, // duration in minutes
  pointsEarned: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Pomodoro', pomodoroSchema);