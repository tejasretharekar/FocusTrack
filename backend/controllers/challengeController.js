// backend/controllers/challengeController.js
const Challenge = require('../models/Challenge');
const User = require('../models/User');

// @desc    Get user's challenges (both created by them and sent to them)
// @route   GET /api/challenges
exports.getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find({
      $or: [{ creator: req.user._id }, { opponent: req.user._id }]
    }).populate('creator opponent', 'name username email'); // Added username
    
    res.status(200).json(challenges);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch challenges' });
  }
};

// @desc    Create a new challenge
// @route   POST /api/challenges
exports.createChallenge = async (req, res) => {
  const { title, type, targetDays, opponentUsername } = req.body;

  try {
    let opponentId = null;
    let initialStatus = 'active';

    // ... inside createChallenge function
    if (type === 'friend') {
      // FIX: Use regex for case-insensitive exact match (^ means start, $ means end, 'i' means case-insensitive)
      const opponent = await User.findOne({ 
        username: { $regex: new RegExp(`^${opponentUsername}$`, 'i') } 
      });
      
      if (!opponent) {
        return res.status(404).json({ message: 'User with that username not found' });
      }
      if (opponent._id.toString() === req.user._id.toString()) {
        return res.status(400).json({ message: 'You cannot challenge yourself' });
      }
      opponentId = opponent._id;
      initialStatus = 'pending'; 
    }

    const newChallenge = await Challenge.create({
      creator: req.user._id,
      opponent: opponentId,
      title,
      type,
      targetDays,
      status: initialStatus
    });

    const populatedChallenge = await Challenge.findById(newChallenge._id).populate('creator opponent', 'name username email');
    res.status(201).json(populatedChallenge);
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

    if (challenge.creatorProgress === challenge.targetDays || challenge.opponentProgress === challenge.targetDays) {
      challenge.status = 'completed';
    }

    await challenge.save();
    res.status(200).json(challenge);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update progress' });
  }
};

// @desc    Decrement progress by 1 day
// @route   PUT /api/challenges/:id/decrement
exports.decrementProgress = async (req, res) => {
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
      if (challenge.creatorProgress > 0) challenge.creatorProgress -= 1;
    } else {
      if (challenge.opponentProgress > 0) challenge.opponentProgress -= 1;
    }

    await challenge.save();
    res.status(200).json(challenge);
  } catch (error) {
    res.status(500).json({ message: 'Failed to decrement progress' });
  }
};

// @desc    Delete a challenge
// @route   DELETE /api/challenges/:id
exports.deleteChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });

    // Only allow creator to delete, or opponent if they are rejecting a pending invite
    if (challenge.creator.toString() !== req.user._id.toString() && 
       (challenge.opponent && challenge.opponent.toString() !== req.user._id.toString())) {
      return res.status(401).json({ message: 'Not authorized to delete this challenge' });
    }

    await challenge.deleteOne();
    res.status(200).json({ message: 'Challenge deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete challenge' });
  }
};

// @desc    Forfeit a challenge
// @route   PUT /api/challenges/:id/forfeit
exports.forfeitChallenge = async (req, res) => {
  try {
    const challenge = await Challenge.findById(req.params.id);
    if (!challenge) return res.status(404).json({ message: 'Challenge not found' });
    if (challenge.status !== 'active') return res.status(400).json({ message: 'Challenge must be active to forfeit' });

    const isCreator = challenge.creator.toString() === req.user._id.toString();
    const isOpponent = challenge.opponent && challenge.opponent.toString() === req.user._id.toString();

    if (!isCreator && !isOpponent) return res.status(401).json({ message: 'Not authorized' });

    challenge.status = 'declined'; 
    await challenge.save();
    
    res.status(200).json(challenge);
  } catch (error) {
    res.status(500).json({ message: 'Failed to forfeit challenge' });
  }
};