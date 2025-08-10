// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BookItem from '../components/BookItem';
import AddBookForm from '../components/AddBookForm';

const HomePage = () => {
  const { user, token } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/books`)
      .then(response => response.json())
      .then(data => {
        setBooks(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleBookAdded = (newBook) => {
    setBooks([newBook, ...books]);
  };

  // This is the complete, correct delete function
  const handleDeleteBook = async (idToDelete) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/${idToDelete}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete book');
      }

      setBooks(books.filter(book => book._id !== idToDelete));

    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book.');
    }
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