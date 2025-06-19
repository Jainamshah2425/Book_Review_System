import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import BookListPage from './pages/BookListPage';
import BookDetail from './pages/BookDetail';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AddBook from './pages/AddBook';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Navbar from './components/Navbar';
import SearchBooks from './components/SearchBooks';
import BookSearch from './components/BookSearch';
import './styles/main.css'; // Import your CSS file for styling

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <Navbar />
          <main className="pt-4">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/" element={
                <ProtectedRoute>
                  <BookSearch />
                </ProtectedRoute>
              } />
              <Route path="/books" element={
                <ProtectedRoute>
                  <BookListPage />
                </ProtectedRoute>
              } />
              <Route path="/books/:id" element={
                <ProtectedRoute>
                  <BookDetail />
                </ProtectedRoute>
              } />
              <Route path="/add-book" element={
                <AdminRoute>
                  <AddBook />
                </AdminRoute>
              } />
              <Route path="/users/:id" element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              } />
              <Route path="/search-books" element={
                <ProtectedRoute>
                  <SearchBooks />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

