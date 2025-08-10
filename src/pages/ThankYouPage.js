// src/pages/ThankYouPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const ThankYouPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Thank You!</h1>
      <p>Your message has been sent successfully.</p>
      <Link to="/">Return to Homepage</Link>
    </div>
  );
};

export default ThankYouPage;