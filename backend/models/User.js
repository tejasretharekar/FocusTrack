// backend/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // ADD THIS NEW FIELD:
  role: { 
    type: String, 
    enum: ['user', 'admin'], 
    default: 'user' // Everyone defaults to a standard user for safety
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);