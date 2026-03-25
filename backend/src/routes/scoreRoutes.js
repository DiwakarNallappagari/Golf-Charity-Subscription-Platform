const express = require('express');
const router = express.Router();
const { addScore, getScores, updateScore, deleteScore } = require('../controllers/scoreController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').post(protect, addScore).get(protect, getScores);
router.route('/:id').put(protect, updateScore).delete(protect, deleteScore);

module.exports = router;
