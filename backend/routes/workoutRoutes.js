// backend/routes/workoutRoutes.js
const express = require('express');
const { getWorkouts, addWorkout, toggleWorkoutCompletion } = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getWorkouts)
  .post(protect, addWorkout);

router.route('/:id/toggle')
  .put(protect, toggleWorkoutCompletion);

module.exports = router;