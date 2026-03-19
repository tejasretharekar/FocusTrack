// backend/models/Challenge.js
const mongoose = require('mongoose');

const challengeSchema = new mongoose.Schema({
  creator: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  opponent: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null // Null if it's a personal challenge
  },
  title: { 
    type: String, 
    required: true // e.g., "No Sugar for 30 Days"
  },
  type: { 
    type: String, 
    enum: ['personal', 'friend'], 
    required: true 
  },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'completed', 'declined'], 
    default: 'active' 
  },
  targetDays: { 
    type: Number, 
    required: true 
  },
  creatorProgress: { 
    type: Number, 
    default: 0 
  },
  opponentProgress: { 
    type: Number, 
    default: 0 
  },
  pointsReward: { 
    type: Number, 
    default: 100 // High reward for completing challenges
  }
}, { timestamps: true });

module.exports = mongoose.model('Challenge', challengeSchema);