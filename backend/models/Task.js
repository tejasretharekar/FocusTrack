// backend/models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['daily (one-time)', 'daily (recurring)', 'long-term'], 
    required: true 
  },
  schedule: {
    frequency: { type: String, enum: ['none', 'daily', 'specific-days'], default: 'none' },
    daysOfWeek: [{ type: Number }] // 0 = Sunday, 1 = Monday, etc.
  },
  isCompleted: { type: Boolean, default: false },
  dueDate: { type: Date } // Important for daily (one-time) and long-term tasks
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);