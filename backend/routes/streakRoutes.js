// backend/routes/streakRoutes.js
const express = require('express');
const { getStreaks } = require('../controllers/streakController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').get(protect, getStreaks);

module.exports = router;