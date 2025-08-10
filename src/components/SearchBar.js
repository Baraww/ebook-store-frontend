// src/components/SearchBar.js
import React, { useState, useEffect } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  // This is the debouncing logic.
  useEffect(() => {
    // Create a timer
    const handler = setTimeout(() => {
      onSearch(searchTerm);
    }, 500); // Wait 500ms after the user stops typing

    // Clear the timer if the user types again
    return () => clearTimeout(handler);
  }, [searchTerm, onSearch]);

  return (
    <div className="search-container">
      <form className="search-bar" onSubmit={(e) => e.preventDefault()}>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
    </div>
  );
};

export default SearchBar;