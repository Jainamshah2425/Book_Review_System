import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function UserProfile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: '', bio: '' });

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:5000/users/profile/${id}`);
      
      if (!response.ok) {
        throw new Error('User not found');
      }
      
      const data = await response.json();
      setProfileData(data);
      setEditForm({ name: data.user.name || '', bio: data.user.bio || '' });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(editForm)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setProfileData(prev => ({
          ...prev,
          user: { ...prev.user, ...updatedUser }
        }));
        setIsEditing(false);
      } else {
        const error = await response.json();
        alert(error.message);
      }
    } catch (error) {
      alert('Failed to update profile');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto"></div>
          <p className="mt-4 text-secondary-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-secondary-800 mb-2">Profile Not Found</h2>
          <p className="text-secondary-600 mb-4">{error || 'This user profile could not be loaded.'}</p>
          <Link to="/books" className="btn-primary">
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  const { user, reviews, stats } = profileData;
  const isOwnProfile = currentUser?._id === user._id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="card p-8 mb-8 animate-fade-in">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
              {user.name ? user.name.charAt(0).toUpperCase() : user.username.charAt(0).toUpperCase()}
            </div>
            
            {/* User Info */}
            <div className="flex-1">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-secondary-800 mb-2">
                    {user.name || user.username}
                  </h1>
                  <p className="text-secondary-600 mb-2">@{user.username}</p>
                  {user.bio && (
                    <p className="text-secondary-700 max-w-2xl">{user.bio}</p>
                  )}
                  <p className="text-sm text-secondary-500 mt-2">
                    Member since {formatDate(user.createdAt)}
                  </p>
                </div>
                
                {isOwnProfile && (
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="btn-secondary"
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Edit Form */}
          {isEditing && (
            <div className="mt-6 p-6 bg-secondary-50 rounded-lg animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="input-field"
                    placeholder="Enter your display name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Bio
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                    className="input-field"
                    rows="3"
                    placeholder="Tell us about yourself..."
                    maxLength="500"
                  />
                  <p className="text-xs text-secondary-500 mt-1">
                    {editForm.bio.length}/500 characters
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleUpdateProfile}
                  className="btn-primary"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {stats.totalReviews}
            </div>
            <div className="text-secondary-600">Total Reviews</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {stats.uniqueBooksReviewed}
            </div>
            <div className="text-secondary-600">Books Reviewed</div>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-primary-600 mb-2">
              {stats.averageRating}
            </div>
            <div className="text-secondary-600">Average Rating</div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-secondary-800 mb-6">
            Recent Reviews ({reviews.length})
          </h2>
          
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review._id} className="border border-secondary-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col lg:flex-row gap-4">
                    {/* Book Cover */}
                    {review.bookId?.coverImage && (
                      <img
                        src={review.bookId.coverImage}
                        alt={review.bookId.title}
                        className="w-20 h-28 object-cover rounded-lg shadow-md"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    
                    <div className="flex-1">
                      {/* Book Info */}
                      <div className="mb-3">
                        <Link
                          to={`/books/${review.bookId._id}`}
                          className="text-lg font-semibold text-primary-600 hover:text-primary-700 transition-colors"
                        >
                          {review.bookId.title}
                        </Link>
                        <p className="text-secondary-600">by {review.bookId.author}</p>
                      </div>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className="star-rating">{renderStars(review.rating)}</span>
                        <span className="text-secondary-600">({review.rating}/5)</span>
                      </div>
                      
                      {/* Review Text */}
                      <p className="text-secondary-700 mb-3">{review.comment}</p>
                      
                      {/* Review Date */}
                      <p className="text-sm text-secondary-500">
                        Reviewed on {formatDate(review.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold text-secondary-800 mb-2">
                No Reviews Yet
              </h3>
              <p className="text-secondary-600 mb-4">
                {isOwnProfile 
                  ? "You haven't written any reviews yet. Start exploring books and share your thoughts!"
                  : "This user hasn't written any reviews yet."
                }
              </p>
              {isOwnProfile && (
                <Link to="/books" className="btn-primary">
                  Browse Books
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
