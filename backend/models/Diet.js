// backend/models/Diet.js
const mongoose = require('mongoose');

const dietItemSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Eggs"
  targetQuantity: { type: String, required: true }, // e.g., "6" or "500ml"
  isCompleted: { type: Boolean, default: false },
  calories: { type: Number, default: 0 }
});

const dietPlanSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  items: [dietItemSchema],
  targetCalories: { type: Number, required: true },
  totalCaloriesConsumed: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Diet', dietPlanSchema);