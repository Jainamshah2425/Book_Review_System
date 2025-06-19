import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookSearch({ onSearchResults, onFiltersChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    
    try {
      setIsSearching(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (selectedGenre) queryParams.append('genre', selectedGenre);
      
      const response = await fetch(`http://localhost:5000/books/search?${queryParams}`);
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      onSearchResults(data);
    } catch (error) {
      setError('Error searching books');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleGenreChange = (e) => {
    const genre = e.target.value;
    setSelectedGenre(genre);
    onFiltersChange?.({ genre });
  };

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600 mb-2">{error}</p>
        <button
          onClick={() => setError(null)}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="mb-8 p-4 bg-white rounded-lg shadow">
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="flex gap-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search books..."
            className="flex-1 p-2 border rounded focus:outline-none focus:border-blue-500"
          />
          
          <select
            value={selectedGenre}
            onChange={handleGenreChange}
            className="p-2 border rounded focus:outline-none focus:border-blue-500"
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
          
          <button
            type="submit"
            disabled={isSearching}
            className={`px-6 py-2 rounded text-white ${
              isSearching 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>
    </div>
  );
}