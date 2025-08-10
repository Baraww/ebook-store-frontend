// src/pages/EditBookPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../components/AddBookForm.css';

const EditBookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    description: '',
    price: '',
  });

  useEffect(() => {
    // Fetch the book's current data to pre-fill the form
    fetch(`${process.env.REACT_APP_API_URL}/api/books/${id}`)
      .then(res => res.json())
      .then(data => {
        setBookData(data);
      })
      .catch(err => console.error("Error fetching book:", err));
  }, [id]);

  const handleChange = (e) => {
    setBookData({
      ...bookData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token,
        },
        body: JSON.stringify({
          ...bookData,
          price: Number(bookData.price) 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update book.');
      }

      alert('Book updated successfully!');
      navigate('/'); // Redirect to homepage after successful update
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="add-book-form">
      <h1>Edit Book</h1>
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" name="title" value={bookData.title} onChange={handleChange} required />

        <label>Author:</label>
        <input type="text" name="author" value={bookData.author} onChange={handleChange} required />

        <label>Description:</label>
        <textarea name="description" value={bookData.description} onChange={handleChange} required />

        <label>Price:</label>
        <input type="number" name="price" value={bookData.price} onChange={handleChange} required step="0.01" />

        {/* Note: Image updating would be a more advanced feature. For now, we are just editing text. */}

        <button type="submit">Update Book</button>
      </form>
    </div>
  );
};

export default EditBookPage;