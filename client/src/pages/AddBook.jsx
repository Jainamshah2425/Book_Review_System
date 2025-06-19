import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AddBook() {
  const navigate = useNavigate();
  const { token, isAdmin } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    isbn: '',
    coverImage: '',
    publicationDate: '',
    genre: '',
    pages: '',
    language: 'English'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Add admin check at component level
  if (!isAdmin) {
    return (
      <div style={styles.container}>
        <div style={styles.error}>
          Access Denied: Only administrators can add books.
        </div>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Process genre field
      const processedData = {
        ...formData,
        genre: formData.genre.split(',').map(g => g.trim()).filter(g => g),
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        publicationDate: formData.publicationDate ? new Date(formData.publicationDate) : undefined
      };

      const response = await fetch('http://localhost:5000/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(processedData)
      });

      const data = await response.json();

      if (response.ok) {
        navigate(`/books/${data._id}`);
      } else {
        setError(data.message || 'Failed to add book');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Error adding book:', error);
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
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
    form: {
      backgroundColor: 'white',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    formGroup: {
      marginBottom: '1.5rem',
    },
    label: {
      display: 'block',
      marginBottom: '0.5rem',
      fontWeight: 'bold',
      color: '#333',
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '1rem',
    },
    textarea: {
      width: '100%',
      minHeight: '120px',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '1rem',
      resize: 'vertical',
      fontFamily: 'inherit',
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '1rem',
    },
    row: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1rem',
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#28a745',
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
    error: {
      color: '#dc3545',
      textAlign: 'center',
      marginBottom: '1rem',
    },
    helpText: {
      fontSize: '0.9rem',
      color: '#666',
      marginTop: '0.25rem',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Add New Book</h1>
        <p style={styles.description}>
          Share a book with the community. Fill in the details below.
        </p>
      </div>

      <form style={styles.form} onSubmit={handleSubmit}>
        {error && <div style={styles.error}>{error}</div>}

        <div style={styles.formGroup}>
          <label style={styles.label}>Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Enter book title"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Author *</label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
            style={styles.input}
            placeholder="Enter author name"
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            style={styles.textarea}
            placeholder="Enter book description"
          />
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>ISBN</label>
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              style={styles.input}
              placeholder="Enter ISBN"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Publication Date</label>
            <input
              type="date"
              name="publicationDate"
              value={formData.publicationDate}
              onChange={handleChange}
              style={styles.input}
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Genre</label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              style={styles.input}
              placeholder="e.g., Fiction, Mystery, Science Fiction"
            />
            <div style={styles.helpText}>
              Separate multiple genres with commas
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Pages</label>
            <input
              type="number"
              name="pages"
              value={formData.pages}
              onChange={handleChange}
              style={styles.input}
              placeholder="Number of pages"
              min="1"
            />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Cover Image URL</label>
            <input
              type="url"
              name="coverImage"
              value={formData.coverImage}
              onChange={handleChange}
              style={styles.input}
              placeholder="https://example.com/cover.jpg"
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Language</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
              <option value="Italian">Italian</option>
              <option value="Portuguese">Portuguese</option>
              <option value="Russian">Russian</option>
              <option value="Chinese">Chinese</option>
              <option value="Japanese">Japanese</option>
              <option value="Korean">Korean</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !formData.title || !formData.author}
          style={loading || !formData.title || !formData.author ? styles.buttonDisabled : styles.button}
        >
          {loading ? 'Adding Book...' : 'Add Book'}
        </button>
      </form>
    </div>
  );
}