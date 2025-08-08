// src/pages/CartPage.js
import React from 'react';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage = () => {
  // Get the new functions from the context
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const totalPrice = cartItems.reduce((total, item) => total + item.quantity * item.price, 0);

  return (
    <div className="cart-container">
      <h1>Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is currently empty.</p>
      ) : (
        <>
          <div className="cart-items">
            {cartItems.map(item => (
              <div key={item._id} className="cart-item">
                <div className="cart-item-details">
                  <h3>{item.title}</h3>
                  {/* Add quantity controls and remove button */}
                  <div className="quantity-controls">
                    <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                  </div>
                  <button onClick={() => removeFromCart(item._id)} className="remove-btn">Remove</button>
                </div>
                <div className="cart-item-price">
                  <p>${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-total">
            <h2>Total: ${totalPrice.toFixed(2)}</h2>
            <button className="checkout-btn">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage;