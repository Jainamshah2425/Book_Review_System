const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Public routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/me', auth, userController.getCurrentUser);
router.get('/profile/:id', userController.getUserProfile);
router.get('/:id', userController.getUser);
router.get('/:id/reviews', userController.getUserReviews);
router.put('/me', auth, userController.updateUser);

module.exports = router;