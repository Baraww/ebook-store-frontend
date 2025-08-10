// src/pages/HomePage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import BookItem from '../components/BookItem';
import AddBookForm from '../components/AddBookForm';
import SearchBar from '../components/SearchBar';

const HomePage = () => {
  const { user, token } = useAuth();
  const [allBooks, setAllBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchError, setSearchError] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    // ... (This useEffect for fetching all books remains the same)
  }, []);

  const handleBookAdded = (newBook) => {
    // ... (This function remains the same)
  };

  const handleDeleteBook = async (idToDelete) => {
    // ... (This function remains the same)
  };

  const handleSearch = useCallback(async (query) => {
    if (!query.trim()) {
      setFilteredBooks(allBooks);
      return;
    }
    setIsSearching(true);
    setSearchError('');
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Search failed.');
      const data = await response.json();
      setFilteredBooks(data);
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('Failed to search books. Please try again.');
    } finally {
      setIsSearching(false);
    }
  }, [allBooks]);

  return (
    <>
      {user && user.role === 'admin' && ( /* ... admin form ... */ )}

      <SearchBar onSearch={handleSearch} />
      {searchError && <p className="error-message">{searchError}</p>}

      <h1>Available Books</h1>
      <div className="book-list">
        {loading ? ( <p>Loading books...</p> ) 
         : isSearching ? ( <p>Searching...</p> ) 
         : filteredBooks.length > 0 ? (
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