// src/pages/ContactPage.js
import React, { useState } from 'react';
import '../components/AddBookForm.css';

const ContactPage = () => {
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);

    setStatus('Sending...');

    try {
      await fetch('/', {
        method: 'POST',
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });
      setStatus('Message sent successfully!');
      form.reset(); // Clear the form after submission
    } catch (error) {
      setStatus('Error: Could not send message.');
    }
  };

  return (
    <div className="add-book-form">
      <h1>Contact Us</h1>

      {status ? (
        <p className={status.includes('successfully') ? 'success' : 'error'}>{status}</p>
      ) : (
        <p>Have a question? Fill out the form below.</p>
      )}

      <form name="contact" 
  method="POST" 
  data-netlify="true"
  data-netlify-honeypot="bot-field"
  onSubmit={handleSubmit}>
        {/* This hidden input is required for the JS submission method */}
        <input type="hidden" name="form-name" value="contact" />
        <input type="hidden" name="bot-field" />

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