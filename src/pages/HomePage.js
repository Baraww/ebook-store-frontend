// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BookItem from '../components/BookItem';
import AddBookForm from '../components/AddBookForm';

const HomePage = () => {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); // 1. Add a loading state

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/books`)
      .then(response => response.json())
      .then(data => {
        setBooks(data);
        setLoading(false); // 2. Set loading to false after data is fetched
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false); // Also set loading to false on error
      });
  }, []);

  const handleBookAdded = (newBook) => {
    setBooks([newBook, ...books]);
  };

  const handleDeleteBook = async (idToDelete) => {
    // ... (keep your existing delete handler)
  };

  return (
    <>
      {user && user.role === 'admin' && (
        <>
          <AddBookForm onBookAdded={handleBookAdded} />
          <hr />
        </>
      )}

      <h1>Available Books</h1>
      <div className="book-list">
        {/* 3. Update the display logic */}
        {loading ? (
          <p>Loading books...</p>
        ) : books.length > 0 ? (
          books.map(book => (
            <BookItem key={book._id} book={book} onDelete={handleDeleteBook} />
          ))
        ) : (
          <p>No books are currently available.</p>
        )}
      </div>
    </>
  );
};

export default HomePage;