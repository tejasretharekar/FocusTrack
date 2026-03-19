// backend/routes/challengeRoutes.js
const express = require('express');
const { 
  getChallenges, 
  createChallenge, 
  acceptChallenge, 
  updateProgress 
} = require('../controllers/challengeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getChallenges)
  .post(protect, createChallenge);

router.route('/:id/accept').put(protect, acceptChallenge);
router.route('/:id/progress').put(protect, updateProgress);

module.exports = router;