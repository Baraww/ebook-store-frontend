// src/context/CartContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => {
  return useContext(CartContext);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const localData = localStorage.getItem('cart');
      return localData ? JSON.parse(localData) : [];
    } catch (error) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // THIS FUNCTION WAS LIKELY MISSING
  const addToCart = (book) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === book._id);
      if (existingItem) {
        return prevItems.map(item =>
          item._id === book._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        return [...prevItems, { ...book, quantity: 1 }];
      }
    });
    alert(`${book.title} was added to your cart!`);
  };

  // THIS FUNCTION WAS LIKELY MISSING
  const removeFromCart = (bookId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== bookId));
  };

  // THIS FUNCTION WAS LIKELY MISSING
  const updateQuantity = (bookId, amount) => {
    setCartItems(prevItems =>
      prevItems.map(item => {
        if (item._id === bookId) {
          const newQuantity = item.quantity + amount;
          return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
        }
        return item;
      }).filter(item => item !== null)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};