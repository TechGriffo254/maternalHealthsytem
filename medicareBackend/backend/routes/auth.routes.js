// --- Authentication Routes ---

const express = require('express');
const router = express.Router();

const { register, login, getMe, logout, updateProfile, changePassword } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/me', protect, getMe);
router.get('/logout', protect, logout);
router.put('/update-profile', protect, updateProfile);
router.post('/change-password', protect, changePassword);

module.exports = router;
