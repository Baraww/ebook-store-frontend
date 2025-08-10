// src/pages/EditBookPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../components/AddBookForm.css';

const EditBookPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [bookData, setBookData] = useState({ title: '', author: '', description: '', price: '' });
  const [newImage, setNewImage] = useState(null); // State for the new image file
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/books/${id}`)
      .then(res => res.json())
      .then(data => setBookData(data))
      .catch(err => console.error("Error fetching book:", err));
  }, [id]);

  const handleChange = (e) => {
    setBookData({ ...bookData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let coverImageUrl = bookData.coverImage; // Start with the existing image URL

    try {
      // If a new image file has been selected, upload it to Cloudinary first
      if (newImage) {
        const formData = new FormData();
        formData.append('file', newImage);
        formData.append('upload_preset', 'etybpx14'); // !!! REPLACE

        const cloudinaryResponse = await fetch(
          `https://api.cloudinary.com/v1_1/djdidad15/image/upload`, // !!! REPLACE
          { method: 'POST', body: formData }
        );
        if (!cloudinaryResponse.ok) throw new Error('New image upload failed.');
        const cloudinaryData = await cloudinaryResponse.json();
        coverImageUrl = cloudinaryData.secure_url; // Get the new image URL
      }

      // Now, update the book in our backend with all the data
      const finalBookData = { ...bookData, coverImage: coverImageUrl, price: Number(bookData.price) };

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/books/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(finalBookData),
      });

      if (!response.ok) throw new Error('Failed to update book.');

      alert('Book updated successfully!');
      navigate('/');
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
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

        <label>Current Cover Image:</label>
        {bookData.coverImage && <img src={bookData.coverImage} alt="Current cover" style={{ width: '100px', marginBottom: '10px' }} />}

        <label>Upload New Cover Image (Optional):</label>
        <input type="file" accept="image/*" onChange={(e) => setNewImage(e.target.files[0])} />

        <button type="submit" disabled={loading}>{loading ? 'Updating...' : 'Update Book'}</button>
      </form>
    </div>
  );
};

export default EditBookPage;