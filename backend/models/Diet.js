// backend/models/Diet.js
const mongoose = require('mongoose');

const dietSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  name: { 
    type: String, 
    required: true // e.g., "Eggs"
  },
  quantity: { 
    type: Number, 
    required: true // e.g., 6
  },
  unit: { 
    type: String, 
    required: true // e.g., "items", "ml", "grams"
  },
  calories: { 
    type: Number, 
    required: true // Total calories for this quantity
  },
  completedDates: { 
    type: [String], // Will store dates like "YYYY-MM-DD"
    default: [] 
  }
}, { timestamps: true });

module.exports = mongoose.model('Diet', dietSchema);