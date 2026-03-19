// backend/routes/pomodoroRoutes.js
const express = require('express');
const { logSession } = require('../controllers/pomodoroController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/log').post(protect, logSession);

module.exports = router;