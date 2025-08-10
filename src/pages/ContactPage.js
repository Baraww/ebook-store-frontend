// src/pages/ContactPage.js
import React from 'react';
import '../components/AddBookForm.css'; 

const ContactPage = () => {
  return (
    <div className="add-book-form">
      <h1>Contact Us</h1>
      <p>Have a question or comment? Fill out the form below and we'll get back to you.</p>

      <form name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
        {/* This hidden input is required by Netlify */}
        <input type="hidden" name="form-name" value="contact" />
        <div hidden>
          <label>Don’t fill this out: <input name="bot-field" /></label>
        </div>

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