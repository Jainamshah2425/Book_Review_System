import React from 'react';
import { Link } from 'react-router-dom';

export default function BookCard({ book }) {
  return (
    <div className="book-card">
      <h3>{book.title}</h3>
      <p><strong>Author:</strong> {book.author}</p>
      <p>{book.description?.slice(0, 100)}...</p>
      <Link to={`/books/${book._id}`}>
        <button>Write Review</button>
      </Link>
    </div>
  );
}
