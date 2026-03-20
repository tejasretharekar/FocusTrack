// backend/controllers/dietController.js
const Diet = require('../models/Diet');

// @desc    Get user's diet plan
// @route   GET /api/diet
exports.getDiet = async (req, res) => {
  try {
    const dietItems = await Diet.find({ user: req.user._id });
    res.status(200).json(dietItems);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch diet plan' });
  }
};

// @desc    Add a new diet item
// @route   POST /api/diet
exports.addDietItem = async (req, res) => {
  const { name, quantity, unit, calories } = req.body;
  try {
    const newItem = await Diet.create({
      user: req.user._id,
      name,
      quantity,
      unit,
      calories
    });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Failed to add diet item' });
  }
};

// @desc    Toggle item completion for a specific date
// @route   PUT /api/diet/:id/toggle
exports.toggleDietCompletion = async (req, res) => {
  const { date } = req.body; // Expects "YYYY-MM-DD"
  
  try {
    const item = await Diet.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    if (item.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });

    const dateIndex = item.completedDates.indexOf(date);
    
    if (dateIndex === -1) {
      // Not completed today, so add the date (tick)
      item.completedDates.push(date);
    } else {
      // Already completed today, so remove the date (untick)
      item.completedDates.splice(dateIndex, 1);
    }

    await item.save();
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Failed to toggle completion' });
  }
};

// @desc    Delete a diet item
// @route   DELETE /api/diet/:id
exports.deleteDietItem = async (req, res) => {
  try {
    const item = await Diet.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    
    // Security check: Only the owner can delete their item
    if (item.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await item.deleteOne();
    res.status(200).json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete item' });
  }
};