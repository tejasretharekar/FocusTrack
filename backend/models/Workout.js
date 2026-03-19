// backend/models/Workout.js
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true // e.g., "Pushups", "Plank"
  },
  type: { 
    type: String, 
    enum: ['reps', 'time'], 
    required: true // Strict validation
  },
  target: { 
    type: Number, 
    required: true // e.g., 15 (reps) or 60 (seconds)
  },
  points: {
    type: Number,
    default: 10 // Base points for the leaderboard
  },
  completedDates: { 
    type: [String], // Array of "YYYY-MM-DD"
    default: [] 
  }
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);