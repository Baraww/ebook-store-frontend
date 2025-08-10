// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BookItem from '../components/BookItem';
import AddBookForm from '../components/AddBookForm';
import SearchBar from '../components/SearchBar';

const HomePage = () => {
  const { user, token } = useAuth(); // Token is now used in handleDeleteBook
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/books`)
      .then(response => response.json())
      .then(data => {
        setAllBooks(data);
        setFilteredBooks(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleBookAdded = (newBook) => {
    setAllBooks([newBook, ...allBooks]);
    setFilteredBooks([newBook, ...allBooks]); // Also update filtered list
  };

  // This is the complete, correct delete function that uses the token
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
      if (!response.ok) throw new Error('Failed to delete book');

      setAllBooks(allBooks.filter(book => book._id !== idToDelete));
      setFilteredBooks(filteredBooks.filter(book => book._id !== idToDelete));
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book.');
    }
  };

  const handleSearch = async (query) => {
    if (!query) {
      setFilteredBooks(allBooks);
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/search?q=${query}`);
      const data = await response.json();
      setFilteredBooks(data);
    } catch (error) {
      console.error('Error searching books:', error);
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

      <SearchBar onSearch={handleSearch} />

      <h1>Available Books</h1>
      <div className="book-list">
        {loading ? (
          <p>Loading books...</p>
        ) : filteredBooks.length > 0 ? (
          filteredBooks.map(book => (
            <BookItem key={book._id} book={book} onDelete={handleDeleteBook} />
          ))
        ) : (
          <p>No books found.</p>
        )}
      </div>
    </>
  );
};

export default HomePage;