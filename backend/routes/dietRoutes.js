// backend/routes/dietRoutes.js
const express = require('express');
const { getDiet, addDietItem, toggleDietCompletion, deleteDietItem } = require('../controllers/dietController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getDiet)
  .post(protect, addDietItem);

router.route('/:id/toggle')
  .put(protect, toggleDietCompletion);

// NEW DELETE ROUTE
router.route('/:id')
  .delete(protect, deleteDietItem);

module.exports = router;