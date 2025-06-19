import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookSearch({ onSearchResults, onFiltersChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [isSearching, setIsSearching] = useState(false); // Added missing state
  const [error, setError] = useState(null); // Added error state
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch genres from your API
    const fetchGenres = async () => {
      try {
        const response = await fetch('http://localhost:5000/books/genres');
        const data = await response.json();
        setGenres(data);
      } catch (error) {
        setError('Failed to fetch genres');
        console.error('Error fetching genres:', error);
      }
    };
    
    fetchGenres();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    try {
      setIsSearching(true); // Set searching state
      setError(null); // Clear any previous errors
      
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (selectedGenre) queryParams.append('genre', selectedGenre);
      
      const response = await fetch(`http://localhost:5000/books/search?${queryParams}`);
      const data = await response.json();
      onSearchResults(data);
    } catch (error) {
      setError('Error searching books');
      console.error('Error searching books:', error);
    } finally {
      setIsSearching(false); // Reset searching state
    }
  };

  const handleGenreChange = (e) => {
    const genre = e.target.value;
    setSelectedGenre(genre);
    onFiltersChange({ genre });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedGenre('');
    onFiltersChange({});
    onSearchResults([]);
  };

  // Show error message if there's an error
  if (error) {
    return (
      <div style={{ ...styles.container, color: 'red' }}>
        <p>{error}</p>
        <button 
          onClick={() => setError(null)}
          style={styles.clearButton}
        >
          Try Again
        </button>
      </div>
    );
  }

  const styles = {
    container: {
      backgroundColor: '#f8f9fa',
      padding: '2rem',
      borderRadius: '8px',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '1.5rem',
      color: '#333',
      marginBottom: '1.5rem',
      textAlign: 'center',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
      maxWidth: '600px',
      margin: '0 auto',
    },
    searchRow: {
      display: 'flex',
      gap: '1rem',
      alignItems: 'center',
    },
    input: {
      flex: 1,
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '1rem',
    },
    select: {
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '1rem',
      minWidth: '150px',
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    buttonDisabled: {
      padding: '12px 24px',
      backgroundColor: '#ccc',
      color: '#666',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'not-allowed',
    },
    clearButton: {
      padding: '8px 16px',
      backgroundColor: '#6c757d',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    },
    buttonRow: {
      display: 'flex',
      gap: '1rem',
      justifyContent: 'center',
      marginTop: '1rem',
    },
    addBookButton: {
      padding: '12px 24px',
      backgroundColor: '#28a745',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Search & Discover Books</h2>
      
      <form style={styles.form} onSubmit={handleSearch}>
        <div style={styles.searchRow}>
          <input
            type="text"
            placeholder="Search by title, author, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={styles.input}
          />
          <button 
            type="submit" 
            disabled={isSearching || !searchTerm.trim()}
            style={isSearching || !searchTerm.trim() ? styles.buttonDisabled : styles.button}
          >
            {isSearching ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        <div style={styles.searchRow}>
          <select 
            value={selectedGenre} 
            onChange={handleGenreChange}
            style={styles.select}
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
        
        <div style={styles.buttonRow}>
          <button 
            type="button" 
            onClick={handleClearFilters}
            style={styles.clearButton}
          >
            Clear Filters
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/add-book')}
            style={styles.addBookButton}
          >
            Add New Book
          </button>
        </div>
      </form>
    </div>
  );
}