const API_BASE = 'http://localhost:5000';
const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

export async function fetchBooks() {
  const res = await fetch(`${API_BASE}/books`);
  return await res.json();
}

export async function fetchBookById(id) {
  const res = await fetch(`${API_BASE}/books/${id}`);
  return await res.json();
}

export async function searchGoogleBooks(query) {
  try {
    const response = await fetch(`${GOOGLE_BOOKS_API}?q=${encodeURIComponent(query)}&maxResults=20`);
    const data = await response.json();
    
    // Transform Google Books data to match our app's format
    return data.items?.map(item => ({
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors?.[0] || 'Unknown Author',
      description: item.volumeInfo.description || 'No description available',
      imageUrl: item.volumeInfo.imageLinks?.thumbnail,
      publishedYear: item.volumeInfo.publishedDate?.split('-')[0],
      genre: item.volumeInfo.categories?.[0] || 'Uncategorized',
      isbn: item.volumeInfo.industryIdentifiers?.[0]?.identifier,
      googleBooksId: item.id
    })) || [];
  } catch (error) {
    console.error('Error fetching books from Google Books:', error);
    return [];
  }
}

export async function addBookFromGoogle(bookData) {
  try {
    const response = await fetch(`${API_BASE}/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(bookData)
    });
    return await response.json();
  } catch (error) {
    console.error('Error adding book:', error);
    throw error;
  }
}

export async function searchBooks(params) {
  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE}/books/search?${queryString}`);
  return await response.json();
}

export async function getBookGenres() {
  const response = await fetch(`${API_BASE}/books/genres`);
  return await response.json();
}

export async function addReview(bookId, reviewData, token) {
  const response = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      bookId,
      ...reviewData
    })
  });
  return await response.json();
}

export async function getBookReviews(bookId) {
  const response = await fetch(`${API_BASE}/reviews/book/${bookId}`);
  return await response.json();
}

// Add more API functions as needed
