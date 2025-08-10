// src/pages/HomePage.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import BookItem from '../components/BookItem';
import AddBookForm from '../components/AddBookForm';
import SearchBar from '../components/SearchBar';

const HomePage = () => {
  const { user, token } = useAuth();
  const [allBooks, setAllBooks] = useState([]); // Stores the full, original list of books
  const [filteredBooks, setFilteredBooks] = useState([]); // Stores the list to be displayed
  const [loading, setLoading] = useState(true);

  // This useEffect runs only once to fetch all books initially
  useEffect(() => {
    const fetchAllBooks = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books`);
        const data = await response.json();
        setAllBooks(data);
        setFilteredBooks(data); // Initially, the displayed list is the full list
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };
    fetchAllBooks();
  }, []);

  const handleBookAdded = (newBook) => {
    const newBookList = [newBook, ...allBooks];
    setAllBooks(newBookList);
    setFilteredBooks(newBookList); // Reset view to show all books with the new one at the top
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

  const handleSearch = async (query) => {
    if (!query) {
      setFilteredBooks(allBooks); // If search is empty, show the original full list
      return;
    }
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/search?q=${query}`);
      const data = await response.json();
      setFilteredBooks(data); // Update the displayed list with search results
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