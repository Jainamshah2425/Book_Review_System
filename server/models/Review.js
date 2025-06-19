const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);


const Review = require('../models/Review');

exports.addReview = async (req, res) => {
  try {
    const { bookId, rating, comment } = req.body;
    
    if (!bookId || !rating || !comment) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const review = new Review({
      bookId,
      user: req.user._id, // From auth middleware
      rating: Number(rating),
      comment
    });

    await review.save();

    // Populate user info before sending response
    const populatedReview = await Review.findById(review._id)
      .populate('user', 'username');

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error('Review creation error:', error);
    res.status(500).json({ message: 'Error creating review' });
  }
};
