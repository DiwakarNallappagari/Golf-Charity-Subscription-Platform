const Draw = require('../models/Draw');
const Score = require('../models/Score');
const User = require('../models/User');

// Helper to generate numbers
const generateNumbers = async (type) => {
  let numbers = [];
  if (type === 'weighted') {
    const scores = await Score.aggregate([
      { $group: { _id: '$value', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    for (let s of scores) {
      if (numbers.length < 5 && !numbers.includes(s._id)) numbers.push(s._id);
    }
  }
  while (numbers.length < 5) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) numbers.push(num);
  }
  return numbers.sort((a, b) => a - b);
};

// Helper to evaluate winners
const evaluateWinners = async (winningNumbers) => {
  const allScores = await Score.find({});
  const userScoresMap = {};
  allScores.forEach(score => {
    if (!userScoresMap[score.user]) userScoresMap[score.user] = new Set();
    userScoresMap[score.user].add(score.value);
  });
  const winners = [];
  for (const [userId, scoreSet] of Object.entries(userScoresMap)) {
    let matchCount = 0;
    winningNumbers.forEach(wn => { if (scoreSet.has(wn)) matchCount++; });
    if (matchCount >= 3) {
      let prizePercentage = matchCount === 5 ? 40 : matchCount === 4 ? 35 : 25;
      winners.push({ user: userId, matchCount, prizePercentage });
    }
  }
  return winners;
};

// @desc    Simulate Draw
// @route   POST /api/draws/simulate
// @access  Private/Admin
const simulateDraw = async (req, res, next) => {
  try {
    const drawType = req.body.type || 'random';
    const winningNumbers = await generateNumbers(drawType);
    const winners = await evaluateWinners(winningNumbers);
    res.json({ winningNumbers, type: drawType, simulatedWinnersCount: winners.length, winners });
  } catch (error) { next(error); }
};

// @desc    Publish Draw
// @route   POST /api/draws/publish
// @access  Private/Admin
const publishDraw = async (req, res, next) => {
  try {
    const drawType = req.body.type || 'random';
    const winningNumbers = await generateNumbers(drawType);
    const winners = await evaluateWinners(winningNumbers);
    const draw = await Draw.create({ winningNumbers, winners, isPublished: true, type: drawType });
    res.status(201).json(draw);
  } catch (error) { next(error); }
};

// @desc    Get Draw history
// @route   GET /api/draws/history
// @access  Private
const getDrawHistory = async (req, res, next) => {
  try {
    const draws = await Draw.find({ isPublished: true })
      .populate('winners.user', 'name email')
      .sort({ createdAt: -1 });
    res.json(draws);
  } catch (error) { next(error); }
};

// @desc    Get current user winnings from latest draw
// @route   GET /api/draws/my-winnings
// @access  Private
const getMyWinnings = async (req, res, next) => {
  try {
    let draw = await Draw.findOne({ isPublished: true }).sort({ createdAt: -1 });
    if (!draw) {
      const winningNumbers = await generateNumbers('random');
      const winners = await evaluateWinners(winningNumbers);
      draw = await Draw.create({ winningNumbers, winners, isPublished: true, type: 'random' });
    }
    const winningNumbers = draw.winningNumbers;
    const userScores = await Score.find({ user: req.user._id });
    const scoreValues = new Set(userScores.map(s => s.value));
    let matchCount = 0;
    winningNumbers.forEach(n => { if (scoreValues.has(n)) matchCount++; });
    const prizeMap = { 1: 50, 2: 100, 3: 200, 4: 1500, 5: 50000 };
    const prize = matchCount >= 1 ? (prizeMap[matchCount] || 0) : 0;
    await User.findByIdAndUpdate(req.user._id, { winningsTotal: prize });
    res.json({ winningNumbers, matchCount, prize, winningsTotal: prize });
  } catch (error) { next(error); }
};

module.exports = { simulateDraw, publishDraw, getDrawHistory, getMyWinnings };
