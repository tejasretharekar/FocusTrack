// backend/routes/dietRoutes.js
const express = require('express');
const { getDiet, addDietItem, toggleDietCompletion } = require('../controllers/dietController');
const { protect } = require('../middleware/authMiddleware'); // We reuse our auth middleware

const router = express.Router();

router.route('/')
  .get(protect, getDiet)
  .post(protect, addDietItem);

router.route('/:id/toggle')
  .put(protect, toggleDietCompletion);

module.exports = router;