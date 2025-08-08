// src/pages/RegisterPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

// We can reuse the CSS from our AddBookForm for now
import '../components/AddBookForm.css'; 

const RegisterPage = () => {
  // A hook from React Router to programmatically redirect the user
  const navigate = useNavigate();

  // State for each form field
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newUser = { name, email, password };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/register`, {
      method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (!response.ok) {
        // If the server response is not OK, throw an error to be caught by the catch block
        throw new Error(data.message || 'Failed to register.');
      }

      // If registration is successful:
      alert('Registration successful! Please log in.');
      navigate('/login'); // Redirect user to the login page

    } catch (error) {
      // Display any errors to the user
      alert(error.message);
    }
  };

  return (
    <div className="add-book-form">
      <h1>Create an Account</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength="6"
        />
        <button type="submit">Create Account</button>
      </form>
    </div>
  );
};

export default RegisterPage;