const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: String,
  isbn: String,
  coverImage: String,
  publicationDate: Date,
  genre: [String],
  pages: Number,
  language: { type: String, default: 'English' },
  featured: { type: Boolean, default: false },
  averageRating: { type: Number, default: 0 },
  totalReviews: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the average rating when reviews are added/updated
BookSchema.methods.updateAverageRating = async function() {
  const Review = require('./Review');
  const reviews = await Review.find({ bookId: this._id });
  
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    this.averageRating = (totalRating / reviews.length).toFixed(1);
    this.totalReviews = reviews.length;
  } else {
    this.averageRating = 0;
    this.totalReviews = 0;
  }
  
  await this.save();
};

module.exports = mongoose.model('Book', BookSchema);
