// src/components/BookItem.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './BookItem.css';

const BookItem = ({ book, onDelete }) => {
  const { user } = useAuth();

  return (
    // This Link component makes the whole card clickable
    <Link to={`/book/${book._id}`} className="book-item-link">
      <div className="book-item">
        <div className="book-cover">
          <span>No Image</span>
        </div>
        <div className="book-details">
          <h3>{book.title}</h3>
          <p>by {book.author}</p>
          <p className="book-price">${book.price.toFixed(2)}</p>
        </div>
        {/* Admin actions are kept separate so they don't trigger the link */}
        {user && user.role === 'admin' && (
          <div className="admin-actions" onClick={(e) => e.preventDefault()}>
            <Link to={`/edit-book/${book._id}`} className="edit-btn">
              Edit
            </Link>
            <button onClick={() => onDelete(book._id)} className="delete-btn">
              Delete
            </button>
          </div>
        )}
      </div>
    </Link>
  );
};

export default BookItem;