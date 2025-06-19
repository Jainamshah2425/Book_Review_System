import React, { useEffect, useState } from 'react';
import BookSearch from '../components/BookSearch';
import BookList from '../components/BookList';

export default function BookListPage() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({});

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      
      if (filters.genre) {
        queryParams.append('genre', filters.genre);
      }
      if (filters.author) {
        queryParams.append('author', filters.author);
      }
      if (filters.featured) {
        queryParams.append('featured', filters.featured);
      }

      const url = `http://localhost:5000/books${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      
      setBooks(data);
      setFilteredBooks(data);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchResults = (searchResults) => {
    setFilteredBooks(searchResults);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
    },
    header: {
      textAlign: 'center',
      marginBottom: '2rem',
    },
    title: {
      fontSize: '2.5rem',
      color: '#333',
      marginBottom: '1rem',
    },
    description: {
      fontSize: '1.1rem',
      color: '#666',
      marginBottom: '2rem',
    },
    loading: {
      textAlign: 'center',
      padding: '2rem',
      fontSize: '1.2rem',
      color: '#666',
    },
    noResults: {
      textAlign: 'center',
      padding: '2rem',
      color: '#666',
      fontStyle: 'italic',
    },
    resultsInfo: {
      textAlign: 'center',
      marginBottom: '2rem',
      color: '#666',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Browse Books</h1>
        <p style={styles.description}>
          Discover amazing books and share your thoughts with the community.
        </p>
      </div>

      <BookSearch 
        onSearchResults={handleSearchResults}
        onFiltersChange={handleFiltersChange}
      />

      {loading ? (
        <div style={styles.loading}>Loading books...</div>
      ) : (
        <>
          {filteredBooks.length > 0 && (
            <div style={styles.resultsInfo}>
              Found {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''}
            </div>
          )}
          
          {filteredBooks.length > 0 ? (
            <BookList books={filteredBooks} />
          ) : (
            <div style={styles.noResults}>
              No books found. Try adjusting your search criteria.
            </div>
          )}
        </>
      )}
    </div>
  );
}
