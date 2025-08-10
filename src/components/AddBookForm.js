// src/components/AddBookForm.js
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './AddBookForm.css';

const AddBookForm = ({ onBookAdded }) => {
  const { token } = useAuth();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert('Please select a cover image.');
      return;
    }
    setUploading(true);

    try {
      // 1. UPLOAD THE IMAGE TO CLOUDINARY
      const formData = new FormData();
      formData.append('file', image);
      // !!! REPLACE WITH YOUR UPLOAD PRESET NAME !!!
      formData.append('upload_preset', 'etybpx14'); 

      // !!! REPLACE WITH YOUR CLOUD NAME !!!
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/djdidad15/image/upload`, 
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!cloudinaryResponse.ok) throw new Error('Image upload failed.');
      const cloudinaryData = await cloudinaryResponse.json();
      const coverImage = cloudinaryData.secure_url;

      // 2. SEND THE BOOK DATA (WITH IMAGE URL) TO OUR BACKEND
      const newBook = { title, author, description, price: Number(price), coverImage };
      const backendResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/books`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-auth-token': token },
        body: JSON.stringify(newBook),
      });

      if (!backendResponse.ok) throw new Error('Failed to add book to database.');
      const addedBook = await backendResponse.json();

      onBookAdded(addedBook);

      // Clear form fields
      e.target.reset(); 
      setTitle('');
      setAuthor('');
      setDescription('');
      setPrice('');
      setImage(null);

    } catch (error) {
      alert(error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="add-book-form">
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        <input type="text" placeholder="Author" value={author} onChange={(e) => setAuthor(e.target.value)} required />
        <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
        <input type="number" placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} required step="0.01" />
        <label>Cover Image:</label>
        <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} required />
        <button type="submit" disabled={uploading}>{uploading ? 'Uploading...' : 'Add Book'}</button>
      </form>
    </div>
  );
};

export default AddBookForm;