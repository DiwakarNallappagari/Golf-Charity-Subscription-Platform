const Draw = require('../models/Draw');
const Score = require('../models/Score');

// Helper to generate numbers
const generateNumbers = async (type) => {
  let numbers = [];
  if (type === 'weighted') {
    // Weighted algorithm based on score frequency
    const scores = await Score.aggregate([
      { $group: { _id: '$value', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    
    for (let s of scores) {
      if (numbers.length < 5 && !numbers.includes(s._id)) {
        numbers.push(s._id);
      }
    }
  }
  
  // Fill remaining slots with random numbers (1-45)
  while (numbers.length < 5) {
    const num = Math.floor(Math.random() * 45) + 1;
    if (!numbers.includes(num)) numbers.push(num);
  }
  
  return numbers.sort((a,b) => a - b);
};

// Helper to evaluate winners
const evaluateWinners = async (winningNumbers) => {
  const allScores = await Score.find({});
  
  // Group by user
  const userScoresMap = {};
  allScores.forEach(score => {
    if(!userScoresMap[score.user]) {
      userScoresMap[score.user] = new Set();
    }
    userScoresMap[score.user].add(score.value);
  });

  const winners = [];
  for (const [userId, scoreSet] of Object.entries(userScoresMap)) {
    let matchCount = 0;
    winningNumbers.forEach(wn => {
      if (scoreSet.has(wn)) matchCount++;
    });

    if (matchCount >= 3) {
      let prizePercentage = 0;
      if (matchCount === 5) prizePercentage = 40;
      if (matchCount === 4) prizePercentage = 35;
      if (matchCount === 3) prizePercentage = 25;

      winners.push({
        user: userId,
        matchCount,
        prizePercentage
      });
    }
  }

  return winners;
};

// @desc    Simulate Draw
// @route   POST /api/draws/simulate
// @access  Private/Admin
const simulateDraw = async (req, res, next) => {
  try {
    const { type } = req.body; // 'random' or 'weighted'
    const drawType = type || 'random';
    
    const winningNumbers = await generateNumbers(drawType);
    const winners = await evaluateWinners(winningNumbers);

    res.json({
      winningNumbers,
      type: drawType,
      simulatedWinnersCount: winners.length,
      winners
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Publish Draw
// @route   POST /api/draws/publish
// @access  Private/Admin
const publishDraw = async (req, res, next) => {
  try {
    const { type } = req.body;
    const drawType = type || 'random';
    
    const winningNumbers = await generateNumbers(drawType);
    const winners = await evaluateWinners(winningNumbers);

    const draw = await Draw.create({
      winningNumbers,
      winners,
      isPublished: true,
      type: drawType
    });

    res.status(201).json(draw);
  } catch (error) {
    next(error);
  }
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
  } catch (error) {
    next(error);
  }
};

module.exports = { simulateDraw, publishDraw, getDrawHistory };
