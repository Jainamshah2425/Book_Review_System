import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SearchBooks from './SearchBooks';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <nav className="bg-gradient-to-r from-primary-600 to-primary-700 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Main Links */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="text-white text-2xl">📚</div>
              <span className="text-white font-bold text-xl">BookReview</span>
            </Link>
            
            <div className="hidden md:flex items-center space-x-8 ml-10">
              
              <Link 
                to="/books" 
                className="text-white hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Browse Books
              </Link>
              <Link 
                to="/add-book" 
                className="text-white hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
              >
                Add Book
              </Link>
            </div>
             <Link
            to="/search-books"
            className="ml-4 px-3 py-1 bg-white text-primary-700 rounded-md text-sm font-medium hover:bg-primary-100 transition-colors duration-200"
          >
            Search Online Books 
          </Link>
          </div>

          
          
          
          {/* User Menu */}
          <div className="flex items-center">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 text-white hover:text-primary-200 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user?.name ? user.name.charAt(0).toUpperCase() : user?.username?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="hidden sm:block text-sm font-medium">
                    {user?.name || user?.username}
                  </span>
                  <svg 
                    className={`w-4 h-4 transition-transform duration-200 ${isMenuOpen ? 'rotate-180' : ''}`}
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 animate-slide-up">
                    <Link
                      to={`/users/${user?._id}`}
                      onClick={() => setIsMenuOpen(false)}
                      className="block px-4 py-2 text-sm text-secondary-700 hover:bg-secondary-100 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <span>👤</span>
                        <span>My Profile</span>
                      </div>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <span>🚪</span>
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login"
                  className="text-white hover:text-primary-200 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Login
                </Link>
                <Link 
                  to="/signup"
                  className="bg-white text-primary-600 hover:bg-primary-50 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <div className="md:hidden ml-4">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-white hover:text-primary-200 p-2 rounded-md"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-primary-700 border-t border-primary-500">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-primary-200 block px-3 py-2 rounded-md text-base font-medium"
              >
                Home
              </Link>
              <Link
                to="/books"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-primary-200 block px-3 py-2 rounded-md text-base font-medium"
              >
                Browse Books
              </Link>
              <Link
                to="/add-book"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:text-primary-200 block px-3 py-2 rounded-md text-base font-medium"
              >
                Add Book
              </Link>
              {isAuthenticated && (
                <>
                  <Link
                    to={`/users/${user?._id}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-white hover:text-primary-200 block px-3 py-2 rounded-md text-base font-medium"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-300 hover:text-red-200 block w-full text-left px-3 py-2 rounded-md text-base font-medium"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
