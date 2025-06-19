import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      navigate('/books');
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '50px auto',
      padding: '2rem',
      backgroundColor: '#fff',
      borderRadius: '8px',
      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
      textAlign: 'center',
      fontSize: '2rem',
      color: '#333',
      marginBottom: '2rem',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '1rem',
    },
    input: {
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '4px',
      fontSize: '1rem',
    },
    button: {
      padding: '12px',
      backgroundColor: '#007bff',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'pointer',
      marginTop: '1rem',
    },
    buttonDisabled: {
      padding: '12px',
      backgroundColor: '#ccc',
      color: '#666',
      border: 'none',
      borderRadius: '4px',
      fontSize: '1rem',
      cursor: 'not-allowed',
      marginTop: '1rem',
    },
    error: {
      color: '#dc3545',
      textAlign: 'center',
      marginBottom: '1rem',
    },
    link: {
      textAlign: 'center',
      marginTop: '1rem',
    },
    linkText: {
      color: '#007bff',
      textDecoration: 'none',
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Login</h1>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        
        <button 
          type="submit" 
          disabled={loading}
          style={loading ? styles.buttonDisabled : styles.button}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      
      <div style={styles.link}>
        <p>
          Don't have an account?{' '}
          <Link to="/signup" style={styles.linkText}>
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
} 