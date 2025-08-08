// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import EditBookPage from './pages/EditBookPage';
import BookDetailPage from './pages/BookDetailPage';
import CartPage from './pages/CartPage'; // 1. Import CartPage
import { useAuth } from './context/AuthContext';
import { useCart } from './context/CartContext'; // 2. Import useCart
import './App.css';

function App() {
  const { token, logout } = useAuth();
  const { cartItems } = useCart(); // 3. Get cartItems from context

  // 4. Calculate total number of items in the cart
  const cartItemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <BrowserRouter>
      <div className="App">
        <nav>
          <Link to="/">Home</Link>
          {token ? (
            <button onClick={logout} className="nav-link-button">Logout</button>
          ) : (
            <>
              | <Link to="/register">Register</Link>
              | <Link to="/login">Login</Link>
            </>
          )}
          {/* 5. Add the link to the Cart page with the item count */}
          | <Link to="/cart">Cart ({cartItemCount})</Link>
        </nav>
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/edit-book/:id" element={<EditBookPage />} />
            <Route path="/book/:id" element={<BookDetailPage />} />
            <Route path="/cart" element={<CartPage />} /> {/* 6. Add the Cart route */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;