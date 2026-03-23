// backend/controllers/workoutController.js
const Workout = require('../models/Workout');

// @desc    Get user's workout plan
// @route   GET /api/workouts
exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id });
    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch workouts' });
  }
};

// @desc    Add a new exercise to the plan
// @route   POST /api/workouts
exports.addWorkout = async (req, res) => {
  const { name, type, target } = req.body; // Notice: 'points' is no longer extracted from req.body

  // HARDCODED POINT LOGIC (Server-side truth)
  let calculatedPoints = 0;
  if (type === 'reps') {
    calculatedPoints = Number(target); // 1 rep = 1 point
  } else if (type === 'time') {
    // target is in seconds. 60 sec = 5 points. 
    // We round it, but use Math.max to ensure they always get at least 1 point.
    calculatedPoints = Math.max(1, Math.round((Number(target) / 60) * 5));
  }

  try {
    const newWorkout = await Workout.create({
      user: req.user._id,
      name,
      type,
      target,
      points: calculatedPoints // Save our securely calculated points
    });
    res.status(201).json(newWorkout);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add workout' });
  }
};


// @desc    Toggle exercise completion for a specific date
// @route   PUT /api/workouts/:id/toggle
exports.toggleWorkoutCompletion = async (req, res) => {
  const { date } = req.body; 
  
  try {
    const workout = await Workout.findById(req.params.id);
    if (!workout) return res.status(404).json({ message: 'Workout not found' });
    if (workout.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    const dateIndex = workout.completedDates.indexOf(date);
    
    if (dateIndex === -1) {
      workout.completedDates.push(date); // Mark done
    } else {
      workout.completedDates.splice(dateIndex, 1); // Mark undone
    }

    await workout.save();
    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle workout' });
  }
};

// @desc    Delete an exercise from the plan
// @route   DELETE /api/workouts/:id
exports.deleteWorkout = async (req, res) => {
  try {
    const workout = await Workout.findById(req.params.id);
    
    if (!workout) {
      return res.status(404).json({ message: 'Workout not found' });
    }
    
    // Ensure the user deleting it actually owns it
    if (workout.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Workout.findByIdAndDelete(req.params.id);
    
    res.status(200).json({ message: 'Workout removed successfully', id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete workout' });
  }
};