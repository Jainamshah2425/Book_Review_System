import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [book, setBook] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
 window.scrollTo(0, 10); // Scroll to top on component mount
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch book details
        const response = await fetch(`http://localhost:5000/books/${id}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch book: ${response.statusText}`);
        }
        const bookData = await response.json();
        setBook(bookData);

        // Fetch reviews with better error handling
        try {
          const reviewsResponse = await fetch(`http://localhost:5000/reviews/book/${id}`);
          if (!reviewsResponse.ok) {
            console.error('Failed to fetch reviews');
            setReviews([]); // Set empty reviews instead of failing
            return;
          }
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData);
        } catch (reviewError) {
          console.error('Error fetching reviews:', reviewError);
          setReviews([]); // Set empty reviews on error
        }

      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id, navigate]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please login to submit a review');
        return;
      }

      const response = await fetch('http://localhost:5000/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          bookId: id,
          rating: parseInt(newReview.rating),
          comment: newReview.comment
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to submit review');
      }

      const newReviewData = await response.json();
      
      // Add user information to the new review
      const reviewWithUser = {
        ...newReviewData,
        user: {
          username: user.username
        },
        createdAt: new Date().toISOString()
      };

      // Add the new review to the beginning of the reviews array
      setReviews(prevReviews => [reviewWithUser, ...prevReviews]);
      
      // Reset form
      setNewReview({ rating: 5, comment: '' });
      
      // Show success message
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      alert(error.message || 'Failed to submit review. Please try again.');
    }
  };

  if (loading) return <div className="text-center py-8">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-600">{error}</div>;
  if (!book) return <div className="text-center py-8">Book not found</div>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="md:flex gap-8">
          
          <div>
            <h1 className="text-3xl font-bold mb-4">{book.title}</h1>
            <p className="text-xl text-gray-600 mb-4">By {book.author}</p>
            <div className="space-y-2 text-gray-600">
              <p>Published: {book.publishedYear}</p>
              <p>Genre: {book.genre}</p>
              <p>Pages: {book.pageCount}</p>
            </div>
            <p className="mt-4">{book.description}</p>
          </div>
        </div>
      </div>

      {/* Review Form - Only show if user is logged in */}
      {user && (
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
          <form onSubmit={handleReviewSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Rating</label>
              <select
                value={newReview.rating}
                onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                className="w-full p-2 border rounded"
              >
                {[5,4,3,2,1].map(num => (
                  <option key={num} value={num}>{num} stars</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Your Review</label>
              <textarea
                value={newReview.comment}
                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                className="w-full p-2 border rounded h-32"
                required
                placeholder="Share your thoughts about this book..."
              />
            </div>
            <button 
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
            >
              Submit Review
            </button>
          </form>
        </div>
      )}

      {/* Reviews List with updated styling */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Reviews ({reviews.length})</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-600 italic">No reviews yet. Be the first to review!</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div 
                key={review._id} 
                className="border-b pb-4 hover:bg-gray-50 transition-colors p-4 rounded"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-600">
                      {review.user?.username || 'Anonymous'}
                    </span>
                    <span className="text-gray-400 text-sm">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
                    {'★'.repeat(review.rating)}
                    <span className="ml-1 text-gray-700">({review.rating})</span>
                  </div>
                </div>
                <p className="text-gray-700 mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}



