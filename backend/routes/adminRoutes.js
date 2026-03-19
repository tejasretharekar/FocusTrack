// backend/routes/adminRoutes.js
const express = require('express');
const { getAllUsers, deleteUser, getSystemStats, getUserDetails } = require('../controllers/adminController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect, admin); 

router.route('/stats').get(getSystemStats);
router.route('/users').get(getAllUsers);
router.route('/users/:id').delete(deleteUser);
// ADD THIS NEW ROUTE:
router.route('/users/:id/details').get(getUserDetails); 

module.exports = router;