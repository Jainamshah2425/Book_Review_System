import React, { useState } from 'react';
import { searchGoogleBooks, addBookFromGoogle } from '../services/api';

export default function SearchBooks() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const books = await searchGoogleBooks(query);
      setResults(books);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddBook = async (book) => {
    try {
      await addBookFromGoogle(book);
      alert('Book added successfully!');
    } catch (error) {
      alert('Failed to add book');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for books..."
            className="flex-1 p-2 border rounded"
          />
          <button 
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={loading}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((book) => (
          <div key={book.googleBooksId} className="border p-4 rounded">
            {book.imageUrl && (
              <img 
                src={book.imageUrl} 
                alt={book.title}
                className="w-full h-48 object-cover mb-2"
              />
            )}
            <h3 className="font-bold">{book.title}</h3>
            <p className="text-gray-600">{book.author}</p>
            <button
              onClick={() => handleAddBook(book)}
              className="mt-2 px-3 py-1 bg-green-500 text-white rounded text-sm"
            >
              Add to Library
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}