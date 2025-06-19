const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');

// Add a new review (protected route)
router.post('/', auth, reviewController.addReview);

// Get reviews for a specific book
router.get('/book/:bookId', reviewController.getBookReviews);

module.exports = router;