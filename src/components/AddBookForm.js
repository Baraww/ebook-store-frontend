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
  const [image, setImage] = useState(null); // State for the image file

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. UPLOAD THE IMAGE TO CLOUDINARY
    const formData = new FormData();
    formData.append('file', image);
    // Replace 'your_preset_name' with the name you copied from Cloudinary
    formData.append('upload_preset', 'etybpx14'); 

    // Replace 'your_cloud_name' with your Cloudinary cloud name
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/djdidad15/image/upload`, 
      {
        method: 'POST',
        body: formData,
      }
    );
    const cloudinaryData = await cloudinaryResponse.json();
    const coverImage = cloudinaryData.secure_url; // Get the image URL

    // 2. SEND THE BOOK DATA (WITH IMAGE URL) TO OUR BACKEND
    const newBook = { title, author, description, price: Number(price), coverImage };

    const backendResponse = await fetch(`${process.env.REACT_APP_API_URL}/api/books`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': token,
      },
      body: JSON.stringify(newBook),
    });

    if (!backendResponse.ok) {
      throw new Error('Failed to add book.');
    }

    const addedBook = await backendResponse.json();
    onBookAdded(addedBook);

    // Clear form fields
    setTitle('');
    setAuthor('');
    setDescription('');
    setPrice('');
    setImage(null);
  };

  return (
    <div className="add-book-form">
      <h2>Add a New Book</h2>
      <form onSubmit={handleSubmit}>
        {/* ... other input fields ... */}
        <input
          type="file"
          onChange={(e) => setImage(e.target.files[0])}
          required
        />
        <button type="submit">Add Book</button>
      </form>
    </div>
  );
};

export default AddBookForm;