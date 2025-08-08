// src/components/AddBookForm.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth
import './AddBookForm.css';

const AddBookForm = ({ onBookAdded }) => {
  const { token } = useAuth(); // 2. Get the token from our context
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!token) {
      alert('You must be logged in to add a book.');
      return;
    }

    const newBook = { title, author, description, price: Number(price) };

    fetch('http://localhost:5000/api/books', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token, // 3. Add the token to the request headers
      },
      body: JSON.stringify(newBook),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add book. Are you logged in?');
        }
        return response.json();
      })
      .then(addedBook => {
        onBookAdded(addedBook);
        setTitle('');
        setAuthor('');
        setDescription('');
        setPrice('');
      })
      .catch(error => console.error('Error adding book:', error));
  };

  // The JSX part of the form remains the same
  return (
    <div className="add-book-form">
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required step="0.01" />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBookForm;