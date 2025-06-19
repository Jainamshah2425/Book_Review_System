import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function ReviewList({ reviews, currentUserId, onReviewUpdate, onReviewDelete }) {
  const { token } = useAuth();
  const [editingReview, setEditingReview] = useState(null);
  const [editForm, setEditForm] = useState({ comment: '', rating: 5 });
  const [loading, setLoading] = useState(false);

  const handleEdit = (review) => {
    setEditingReview(review._id);
    setEditForm({ comment: review.comment, rating: review.rating });
  };

  const handleCancelEdit = () => {
    setEditingReview(null);
    setEditForm({ comment: '', rating: 5 });
  };

  const handleSaveEdit = async (reviewId) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/reviews/${reviewId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updatedReview = await response.json();
        onReviewUpdate(updatedReview);
        setEditingReview(null);
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Error updating review:', error);
      alert('Failed to update review');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/reviews/${reviewId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        onReviewDelete(reviewId);
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (reviews.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📝</div>
        <h3 className="text-xl font-semibold text-secondary-800 mb-2">
          No Reviews Yet
        </h3>
        <p className="text-secondary-600">
          Be the first to share your thoughts about this book!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review._id} className="card p-6 animate-slide-up">
          {editingReview === review._id ? (
            // Edit Form
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                  {review.username.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-semibold text-secondary-800">{review.username}</h4>
                  <p className="text-sm text-secondary-600">{formatDate(review.createdAt)}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Rating
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setEditForm({ ...editForm, rating: star })}
                      className={`text-2xl transition-colors duration-200 ${
                        star <= editForm.rating 
                          ? 'text-yellow-400 hover:text-yellow-500' 
                          : 'text-gray-300 hover:text-yellow-400'
                      } cursor-pointer`}
                    >
                      ★
                    </button>
                  ))}
                  <span className="text-secondary-600 text-sm">({editForm.rating}/5)</span>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Review
                </label>
                <textarea
                  value={editForm.comment}
                  onChange={(e) => setEditForm({ ...editForm, comment: e.target.value })}
                  className="input-field min-h-[100px] resize-vertical"
                  required
                  minLength="10"
                />
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleSaveEdit(review._id)}
                  disabled={loading || editForm.comment.length < 10}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    loading || editForm.comment.length < 10
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700 text-white'
                  }`}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            // Review Display
            <div>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {review.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-semibold text-secondary-800">{review.username}</h4>
                    <p className="text-sm text-secondary-600">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                
                {currentUserId === review.userId && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(review._id)}
                      className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-2 mb-3">
                <span className="star-rating text-lg">{renderStars(review.rating)}</span>
                <span className="text-secondary-600">({review.rating}/5)</span>
              </div>
              
              <p className="text-secondary-700 leading-relaxed">{review.comment}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
} 