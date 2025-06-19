import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
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

function AppContent() {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/register'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {!isAuthPage && <Navbar />}
      <main className={isAuthPage ? 'pt-0' : 'pt-4'}>
        <Routes>
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
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
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
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

