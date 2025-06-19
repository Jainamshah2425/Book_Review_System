const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');

// Get reviews for a specific book
router.get('/book/:bookId', reviewController.getBookReviews);

// Add a new review (protected route)
router.post('/', auth, reviewController.addReview);

module.exports = router;