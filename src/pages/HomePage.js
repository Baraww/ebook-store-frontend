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
    const fetchAllBooks = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books`);
        const data = await response.json();
        setAllBooks(data);
        setFilteredBooks(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAllBooks();
  }, []);

  const handleBookAdded = (newBook) => {
    const newBookList = [newBook, ...allBooks];
    setAllBooks(newBookList);
    setFilteredBooks(newBookList);
  };

  const handleDeleteBook = async (idToDelete) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/${idToDelete}`, {
        method: 'DELETE',
        headers: { 'x-auth-token': token },
      });
      if (!response.ok) throw new Error('Failed to delete book');

      const newAllBooks = allBooks.filter(book => book._id !== idToDelete);
      setAllBooks(newAllBooks);
      setFilteredBooks(newAllBooks);
    } catch (error) {
      console.error('Error deleting book:', error);
      alert('Failed to delete book.');
    }
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
      {user && user.role === 'admin' && (
        <>
          <AddBookForm onBookAdded={handleBookAdded} />
          <hr />
        </>
      )}

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