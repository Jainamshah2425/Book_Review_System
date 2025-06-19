const Book = require('../models/Book');

const seedBooks = async () => {
  try {
    const res = await fetch('https://www.googleapis.com/books/v1/volumes?q=subject:fiction&maxResults=15');
    const data = await res.json();

    const books = data.items.map(item => ({
      title: item.volumeInfo.title || 'Untitled',
      author: (item.volumeInfo.authors || ['Unknown'])[0],
      description: item.volumeInfo.description || 'No description.',
      featured: true
    }));

    const count = await Book.countDocuments();
    if (count === 0) {
      await Book.insertMany(books);
      console.log('Sample books seeded.');
    }
  } catch (error) {
    console.error('Error seeding books:', error);
  }
};

module.exports = seedBooks;