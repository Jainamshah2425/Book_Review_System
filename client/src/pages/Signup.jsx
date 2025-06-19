import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    adminCode: '' // Add this field
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
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

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    const result = await register(
      formData.username,
      formData.email,
      formData.password,
      formData.name
    );
    
    if (result.success) {
      navigate('/');
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
      backgroundColor: '#28a745',
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
      <h1 style={styles.title}>Sign Up</h1>
      
      {error && <div style={styles.error}>{error}</div>}
      
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={styles.input}
        />
        
        <input
          type="text"
          name="name"
          placeholder="Full Name (optional)"
          value={formData.name}
          onChange={handleChange}
          style={styles.input}
        />
        
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
        
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          style={styles.input}
        />
        
        {/* Add admin code field */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Admin Code (Optional)
          </label>
          <input
            type="password"
            name="adminCode"
            value={formData.adminCode}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={loading ? styles.buttonDisabled : styles.button}
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      
      <div style={styles.link}>
        <p>
          Already have an account?{' '}
          <Link to="/login" style={styles.linkText}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
}