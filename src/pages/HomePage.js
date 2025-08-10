// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BookItem from '../components/BookItem';
import AddBookForm from '../components/AddBookForm';
import SearchBar from '../components/SearchBar'; // 1. Import the SearchBar

const HomePage = () => {
  const { user, token } = useAuth();
  const [allBooks, setAllBooks] = useState([]); // To store the original list
  const [filteredBooks, setFilteredBooks] = useState([]); // To display
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/books`)
      .then(response => response.json())
      .then(data => {
        setAllBooks(data);
        setFilteredBooks(data); // Initially, show all books
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setLoading(false);
      });
  }, []);

  const handleBookAdded = (newBook) => {
    setAllBooks([newBook, ...allBooks]);
    setFilteredBooks([newBook, ...filteredBooks]);
  };

  const handleDeleteBook = async (idToDelete) => {
    // ... (keep your existing delete handler)
    // Make sure it updates BOTH allBooks and filteredBooks state
    setAllBooks(allBooks.filter(book => book._id !== idToDelete));
    setFilteredBooks(filteredBooks.filter(book => book._id !== idToDelete));
  };

  // 2. This function handles the search
  const handleSearch = async (query) => {
    if (!query) {
      setFilteredBooks(allBooks); // If search is empty, show all books
      return;
    }
    try {
      // Call our new backend search endpoint
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/search?q=${query}`);
      const data = await response.json();
      setFilteredBooks(data); // Update the display with search results
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

      {/* 3. Render the SearchBar */}
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
          <p>No books found matching your search.</p>
        )}
      </div>
    </>
  );
};

export default HomePage;