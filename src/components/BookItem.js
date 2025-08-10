// src/components/BookItem.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './BookItem.css';

const BookItem = ({ book, onDelete }) => {
  const { user } = useAuth();

  return (
    <div className="book-item">
      <Link to={`/book/${book._id}`} className="book-item-main-link">
        <div className="book-cover">
          {book.coverImage ? (
            <img src={book.coverImage} alt={book.title} />
          ) : (
            <span>No Image</span>
          )}
        </div>
        <div className="book-details">
          <h3>{book.title}</h3>
          <p className="book-author">by {book.author}</p>
          <p className="book-description">
            {book.description.substring(0, 100)}...
          </p>
          <p className="book-price">${book.price.toFixed(2)}</p>
        </div>
      </Link>
      {user && user.role === 'admin' && (
        <div className="admin-actions">
          <Link to={`/edit-book/${book._id}`} className="edit-btn">
            Edit
          </Link>
          <button onClick={() => onDelete(book._id)} className="delete-btn">
            Delete
          </button>
        </div>
      )}
    </div>
  );
}; // <-- This closing brace and semicolon was likely the missing part.

export default BookItem;