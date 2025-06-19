import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function BookList({ books }) {
  const navigate = useNavigate();

  const styles = {
    container: {
      maxWidth: '1400px', // Increased max width
      margin: '0 auto',
      padding: '0 2rem', // Added horizontal padding
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '3rem', // Increased gap
      padding: '2rem', // Increased padding
    },
    card: {
      background: 'white',
      borderRadius: '12px', // Increased border radius
      padding: '1.5rem', // Increased padding
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      width: '100%', // Ensure full width
    },
    image: {
      width: '100%',
      height: '400px', // Increased height
      objectFit: 'cover',
      borderRadius: '8px',
      marginBottom: '1.5rem'
    },
    title: {
      fontSize: '1.4rem', // Increased font size
      fontWeight: 'bold',
      marginBottom: '1rem',
      color: '#333'
    },
    author: {
      fontSize: '1.1rem', // Increased font size
      color: '#666',
      marginBottom: '1rem'
    },
    description: {
      fontSize: '1rem',
      color: '#444',
      display: '-webkit-box',
      WebkitLineClamp: 3,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
      flex: '1',
      lineHeight: '1.6' // Improved readability
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.grid}>
        {books.map((book) => (
          <div
            key={book._id}
            style={styles.card}
            onClick={() => navigate(`/books/${book._id}`)}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)'; // Increased lift
              e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
            }}
          >
            
            <h3 style={styles.title}>{book.title}</h3>
            <p style={styles.author}>By {book.author}</p>
            <p style={styles.description}>{book.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}