// backend/routes/challengeRoutes.js
const express = require('express');
const { 
  getChallenges, 
  createChallenge, 
  acceptChallenge, 
  updateProgress,
  decrementProgress,
  deleteChallenge,
  forfeitChallenge
} = require('../controllers/challengeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.route('/')
  .get(protect, getChallenges)
  .post(protect, createChallenge);

router.route('/:id/accept').put(protect, acceptChallenge);
router.route('/:id/progress').put(protect, updateProgress);
router.route('/:id/decrement').put(protect, decrementProgress);
router.route('/:id/forfeit').put(protect, forfeitChallenge);
router.route('/:id').delete(protect, deleteChallenge);

module.exports = router;