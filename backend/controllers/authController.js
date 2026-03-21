// backend/controllers/authController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.registerUser = async (req, res) => {
  const { name, username, password } = req.body;
  try {
    const userExists = await User.findOne({ username });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const user = await User.create({ name, username, password });
    if (user) {
      res.status(201).json({
        _id: user.id, name: user.name, username: user.username, role: user.role,
        token: generateToken(user._id)
      });
    }
  } catch (error) {
    console.error("REGISTRATION ERROR: ", error); // This forces it to show in Render logs
    res.status(500).json({ message: error.message }); // This sends the exact error to your browser
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user.id, name: user.name, username: user.username, role: user.role,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error("REGISTRATION ERROR: ", error); // This forces it to show in Render logs
    res.status(500).json({ message: error.message }); // This sends the exact error to your browser
  }
};