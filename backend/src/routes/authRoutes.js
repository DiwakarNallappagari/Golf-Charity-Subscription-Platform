const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile, subscribeUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getUserProfile);
router.post('/subscribe', protect, subscribeUser);

module.exports = router;
