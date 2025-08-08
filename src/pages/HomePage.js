// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BookItem from '../components/BookItem';
import AddBookForm from '../components/AddBookForm';

const HomePage = () => {
  const { user, token } = useAuth(); // We need the token to authorize the delete request
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/books`)
      .then(response => response.json())
      .then(data => setBooks(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleBookAdded = (newBook) => {
    setBooks([newBook, ...books]);
  };

  // This is our new delete handler function
  const handleDeleteBook = async (idToDelete) => {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return; // Stop if the user clicks "Cancel"
    }

    try {
      await fetch(`${process.env.REACT_APP_API_URL}/api/books/${idToDelete}`, {
        method: 'DELETE',
        headers: {
          'x-auth-token': token, // Send the token for authorization
        },
      });

      // Update the UI by removing the deleted book from the state
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
        {books.length > 0 ? (
          // Pass the handleDeleteBook function as a prop to each BookItem
          books.map(book => (
            <BookItem key={book._id} book={book} onDelete={handleDeleteBook} />
          ))
        ) : (
          <p>No books available.</p>
        )}
      </div>
    </>
  );
};

export default HomePage;