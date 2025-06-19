const Review = require('../models/Review');

// Get reviews for a specific book
exports.getBookReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ bookId: req.params.bookId })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Error fetching reviews', error: error.message });
  }
};

// Add a new review
exports.addReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;

    // Validate input
    if (!bookId || !rating || !comment) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if user has already reviewed this book
    const existingReview = await Review.findOne({
      bookId,
      user: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = new Review({
      bookId,
      user: req.user._id,
      rating: Number(rating),
      comment,
      createdAt: new Date()
    });

    await review.save();

    // Populate user information before sending response
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'username');

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error('Error adding review:', error);
    res.status(500).json({ message: 'Error adding review', error: error.message });
  }
};

exports.updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, rating } = req.body;
    const userId = req.userId;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    review.comment = comment;
    review.rating = rating;
    review.updatedAt = new Date();

    await review.save();
    
    const updatedReview = await Review.findById(id)
      .populate('userId', 'username name');

    res.json(updatedReview);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await review.remove();
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};