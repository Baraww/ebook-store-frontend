// src/pages/ContactPage.js
import React from 'react';
// Let's reuse the form styling
import '../components/AddBookForm.css'; 

const ContactPage = () => {
  return (
    <div className="add-book-form">
      <h1>Contact Us</h1>
      <p>Have a question or comment? Fill out the form below and we'll get back to you.</p>

      {/* This is the Netlify Form */}
      <form name="contact" method="POST" data-netlify="true">
        {/* This hidden input is required by Netlify */}
        <input type="hidden" name="form-name" value="contact" />

        <label>Your Name:</label>
        <input type="text" name="name" required />

        <label>Your Email:</label>
        <input type="email" name="email" required />

        <label>Message:</label>
        <textarea name="message" required></textarea>

        <button type="submit">Send Message</button>
      </form>
    </div>
  );
};

export default ContactPage;