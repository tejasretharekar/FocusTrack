// backend/models/Workout.js
const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['reps', 'time'], required: true },
  targetValue: { type: Number, required: true }, // 15 (reps) OR 60 (seconds)
  isCompleted: { type: Boolean, default: false }
});

const workoutPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  planName: { type: String, default: 'Daily Workout' },
  exercises: [exerciseSchema],
  pointsEarned: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutPlanSchema);