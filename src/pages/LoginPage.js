// src/pages/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import our custom hook
import '../components/AddBookForm.css';

const LoginPage = () => {
  const { login } = useAuth(); // Get the login function from the context
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);

      login(data.token); // Use the login function from context
      alert('Login successful!');
      navigate('/');
    } catch (error) {
      alert(error.message);
    }
  };

  // The JSX for the form remains the same...
  return (
    <div className="add-book-form">
      <h1>Login to Your Account</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;