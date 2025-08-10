// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import EditBookPage from './pages/EditBookPage';
import BookDetailPage from './pages/BookDetailPage';
import CartPage from './pages/CartPage';
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext';
import './App.css';
import ContactPage from './pages/ContactPage'; // 1. Import ContactPage
import ThankYouPage from './pages/ThankYouPage';



// A small, separate component to get the real-time cart count
const CartLink = () => {
  const { cartItems } = useCart();
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);
  return (
    <>
      | <Link to="/cart">Cart ({cartItemCount})</Link>
    </>
  );
};

function App() {
  const { token, logout } = useAuth();
  const { clearCart } = useCart();

  const handleLogout = () => {
    logout();
    clearCart();
  };

  return (
    <BrowserRouter>
      <div className="App">
        // Inside src/App.js
<nav>
  <Link to="/">Home</Link>
  <Link to="/contact">Contact</Link>
  <div className="nav-right">
    {token ? (
      <button onClick={handleLogout} className="nav-link-button">Logout</button>
    ) : (
      <>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
      </>
    )}
    <CartLink />
  </div>
</nav>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/edit-book/:id" element={<EditBookPage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/contact" element={<ContactPage />} /> 
            <Route path="/thank-you" element={<ThankYouPage />}/>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;