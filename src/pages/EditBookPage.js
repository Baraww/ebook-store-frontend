// src/pages/EditBookPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../components/AddBookForm.css'; // We can reuse the same form styling

const EditBookPage = () => {
  const { id } = useParams(); // Get the book ID from the URL
  const navigate = useNavigate();
  const { token } = useAuth();

  // State for each form field
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');

  // useEffect to fetch the book data when the component loads
  useEffect(() => {
    fetch(`http://localhost:5000/api/books/${id}`)
      .then(res => res.json())
      .then(data => {
        // Pre-fill the form with the fetched book data
        setTitle(data.title);
        setAuthor(data.author);
        setDescription(data.description);
        setPrice(data.price);
      })
      .catch(err => console.error("Error fetching book:", err));
  }, [id]); // This effect depends on the 'id' from the URL

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedBook = { title, author, description, price: Number(price) };

    try {
      const response = await fetch(`http://localhost:5000/api/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token, // Send the token for admin authorization
        },
        body: JSON.stringify(updatedBook),
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
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required step="0.01" />
        <button type="submit">Update Book</button>
      </form>
    </div>
  );
};

export default EditBookPage;