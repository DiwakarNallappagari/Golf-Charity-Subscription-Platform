const Score = require('../models/Score');

const addScore = async (req, res, next) => {
  try {
    const { value } = req.body;
    if (value === undefined || value < 1 || value > 45) {
      res.status(400); throw new Error('Valid score between 1 and 45 required');
    }

    const userScores = await Score.find({ user: req.user._id }).sort({ createdAt: 1 });
    
    // Subscription Check: Free up to 5 scores
    if (userScores.length >= 5 && req.user.subscription?.status !== 'active') {
      res.status(403);
      throw new Error('Free tier limit reached. Please upgrade to Premium to continue logging scores!');
    }

    // Strict 5 Score FIFO replacement per PRD Document
    if (userScores.length >= 5) {
      await Score.findByIdAndDelete(userScores[0]._id);
    }

    const score = await Score.create({
      user: req.user._id,
      value: Number(value),
    });
    res.status(201).json(score);
  } catch (error) { next(error); }
};

const getScores = async (req, res, next) => {
  try {
    const scores = await Score.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(scores);
  } catch (error) { next(error); }
};

const updateScore = async (req, res, next) => {
  try {
    const { value } = req.body;
    if (value === undefined || value < 1 || value > 45) {
      res.status(400); throw new Error('Valid score between 1 and 45 required');
    }
    const score = await Score.findById(req.params.id);
    if (!score) { res.status(404); throw new Error('Score not found'); }
    if (score.user.toString() !== req.user._id.toString()) {
      res.status(401); throw new Error('User not authorized');
    }
    score.value = Number(value);
    const updatedScore = await score.save();
    res.json(updatedScore);
  } catch (error) { next(error); }
};

const deleteScore = async (req, res, next) => {
  try {
    const score = await Score.findById(req.params.id);
    if (!score) { res.status(404); throw new Error('Score not found'); }
    if (score.user.toString() !== req.user._id.toString()) {
      res.status(401); throw new Error('User not authorized');
    }
    await score.deleteOne();
    res.json({ message: 'Score removed' });
  } catch (error) { next(error); }
};

module.exports = { addScore, getScores, updateScore, deleteScore };
