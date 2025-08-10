// src/pages/BookDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext'; // 1. Import useCart
import './BookDetailPage.css';

const BookDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart(); // 2. Get the addToCart function
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/api/books/${id}`)
      .then(res => res.json())
      .then(data => {
        setBook(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching book details:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <p>Loading book details...</p>;
  }

  if (!book) {
    return <p>Book not found.</p>;
  }

  return (
    <div className="book-detail-container">
      <div className="book-detail-image">
        {book.coverImage ? (
      <img src={book.coverImage} alt={book.title} />
        ) : (
    <span>Book Cover Image</span>
        )}
    </div>
      <div className="book-detail-info">
        <h1>{book.title}</h1>
        <h2>by {book.author}</h2>
        <p className="price">${book.price.toFixed(2)}</p>
        <p className="description">{book.description}</p>
        {/* 3. Add the onClick handler to the button */}
        <button onClick={() => addToCart(book)} className="add-to-cart-btn">
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default BookDetailPage;