// src/components/SearchBar.js
import React, { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
  // ... (your existing useState and handleSubmit logic) ...
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Search button clicked! Searching for:', searchTerm);
    onSearch(searchTerm);
  };

  return (
    <div className="search-container"> {/* Add this wrapper div */}
      <form className="search-bar" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search by title or author..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>
    </div>
  );
};

export default SearchBar;