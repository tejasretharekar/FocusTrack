const express = require('express');
// Added deleteWorkout here
const { getWorkouts, addWorkout, toggleWorkoutCompletion, deleteWorkout } = require('../controllers/workoutController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getWorkouts)
  .post(protect, addWorkout);

router.route('/:id/toggle')
  .put(protect, toggleWorkoutCompletion);

// NEW: Added the delete route
router.route('/:id')
  .delete(protect, deleteWorkout);

module.exports = router;