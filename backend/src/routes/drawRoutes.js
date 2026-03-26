const express = require('express');
const router = express.Router();
const { simulateDraw, publishDraw, getDrawHistory, getMyWinnings } = require('../controllers/drawController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.post('/simulate', protect, admin, simulateDraw);
router.post('/publish', protect, admin, publishDraw);
router.get('/history', protect, getDrawHistory);
router.get('/my-winnings', protect, getMyWinnings);

module.exports = router;
