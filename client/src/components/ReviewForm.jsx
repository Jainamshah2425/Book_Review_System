import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ReviewForm({ bookId, onReviewAdded, existingReview }) {
  const { token, user } = useAuth();
  const [form, setForm] = useState({ comment: '', rating: 5 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hoveredRating, setHoveredRating] = useState(0);

  useEffect(() => {
    if (existingReview) {
      setForm({ comment: existingReview.comment, rating: existingReview.rating });
    }
  }, [existingReview]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (form.comment.length < 10) {
      setError('Review must be at least 10 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:5000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId,
          comment: form.comment,
          rating: form.rating
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onReviewAdded(data);
        setForm({ comment: '', rating: 5 });
        setError('');
      } else {
        setError(data.message || 'Failed to submit review');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error submitting review:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating, interactive = false) => {
    const stars = [];
    const displayRating = interactive ? hoveredRating || rating : rating;
    
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          type={interactive ? "button" : undefined}
          onClick={interactive ? () => setForm({ ...form, rating: i }) : undefined}
          onMouseEnter={interactive ? () => setHoveredRating(i) : undefined}
          onMouseLeave={interactive ? () => setHoveredRating(0) : undefined}
          className={`text-2xl transition-colors duration-200 ${
            i <= displayRating 
              ? 'text-yellow-400 hover:text-yellow-500' 
              : 'text-gray-300 hover:text-yellow-400'
          } ${interactive ? 'cursor-pointer' : ''}`}
          disabled={!interactive}
        >
          ★
        </button>
      );
    }
    return stars;
  };

  if (existingReview) {
    return (
      <div className="card p-6 mb-6 animate-fade-in">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="text-yellow-600 text-xl">📝</div>
            <div>
              <h4 className="font-semibold text-yellow-800 mb-1">
                You have already reviewed this book
              </h4>
              <div className="flex items-center gap-2 mb-2">
                <span className="star-rating">{renderStars(existingReview.rating)}</span>
                <span className="text-yellow-700">({existingReview.rating}/5)</span>
              </div>
              <p className="text-yellow-700 text-sm">{existingReview.comment}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 mb-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
          {user?.name ? user.name.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-secondary-800">
            Write a Review
          </h3>
          <p className="text-sm text-secondary-600">
            Share your thoughts about this book
          </p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Rating Section */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Your Rating
          </label>
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              {renderStars(form.rating, true)}
            </div>
            <span className="text-secondary-600 text-sm">
              ({form.rating}/5)
            </span>
          </div>
        </div>
        
        {/* Review Text */}
        <div>
          <label className="block text-sm font-medium text-secondary-700 mb-2">
            Your Review
          </label>
          <textarea
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            placeholder="Share your thoughts about this book... (minimum 10 characters)"
            required
            className="input-field min-h-[120px] resize-vertical"
            minLength="10"
            maxLength="1000"
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-secondary-500">
              Minimum 10 characters required
            </p>
            <p className="text-xs text-secondary-500">
              {form.comment.length}/1000
            </p>
          </div>
        </div>
        
        {/* Submit Button */}
        <div className="flex items-center justify-between pt-2">
          <div className="text-sm text-secondary-600">
            Your review will be visible to all users
          </div>
          <button 
            type="submit" 
            disabled={loading || form.comment.length < 10}
            className={`px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
              loading || form.comment.length < 10
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary-600 hover:bg-primary-700 text-white hover:shadow-lg transform hover:-translate-y-0.5'
            }`}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Submitting...
              </div>
            ) : (
              'Submit Review'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
