// backend/controllers/challengeController.js
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// @desc    Get user's challenges (both created by them and sent to them)
// @route   GET /api/challenges
exports.getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({
      $or: [{ creator: req.user._id }, { opponent: req.user._id }]
    }).populate('creator opponent', 'name email'); // Fetch names to display in UI
    
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch challenges' });
  }
};

// @desc    Create a new challenge
// @route   POST /api/challenges
exports.createChallenge = async (req, res) => {
  const { title, type, targetDays, opponentEmail } = req.body;

  try {
    let opponentId = null;
    let initialStatus = 'active';

    // If it's a friend challenge, find the opponent's ID
    if (type === 'friend') {
      const opponent = await User.findOne({ email: opponentEmail });
      if (!opponent) {
        return res.status(404).json({ message: 'User with that email not found' });
      }
      if (opponent._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'You cannot challenge yourself' });
      }
      opponentId = opponent._id;
      initialStatus = 'pending'; // Requires opponent to accept
    }

    const newChallenge = await Challenge.create({
      creator: req.user._id,
      opponent: opponentId,
      title,
      type,
      targetDays,
      status: initialStatus
    });

    res.status(201).json(newChallenge);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create challenge' });
  }
};

// @desc    Accept a friend challenge
// @route   PUT /api/challenges/:id/accept
exports.acceptChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    
    // Only the opponent can accept it
    if (challenge.opponent.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized to accept this challenge' });
    }

    challenge.status = 'active';
    await challenge.save();
    res.status(200).json(challenge);
  } catch (error) {
    res.status(500).json({ message: 'Failed to accept challenge' });
  }
};

// @desc    Increment progress by 1 day
// @route   PUT /api/challenges/:id/progress
exports.updateProgress = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    if (challenge.status !== 'active') return res.status(400).json({ message: 'Challenge is not active' });

    const isCreator = challenge.creator.toString() === req.user._id.toString();
    const isOpponent = challenge.opponent && challenge.opponent.toString() === req.user._id.toString();

    if (!isCreator && !isOpponent) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (isCreator) {
      if (challenge.creatorProgress < challenge.targetDays) challenge.creatorProgress += 1;
    } else {
      if (challenge.opponentProgress < challenge.targetDays) challenge.opponentProgress += 1;
    }

    // Check if anyone won
    if (challenge.creatorProgress === challenge.targetDays || challenge.opponentProgress === challenge.targetDays) {
      challenge.status = 'completed';
      // In a full production app, you would inject the 100 points into the winner's total here
    }

    await challenge.save();
    res.status(200).json(challenge);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update progress' });
  }
};