import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SearchBar.css';

const SearchBar = ({ inline }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ search: '', listingType: '', type: '', city: '' });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    Object.entries(form).forEach(([k, v]) => v && params.set(k, v));
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <form className={`search-bar ${inline ? 'inline' : ''}`} onSubmit={handleSearch}>
      <div className="search-fields">
        <input
          name="search" placeholder="Search by location or keyword..."
          className="search-input" value={form.search} onChange={handleChange}
        />
        <select name="listingType" className="search-select" value={form.listingType} onChange={handleChange}>
          <option value="">Buy or Rent</option>
          <option value="sale">Buy</option>
          <option value="rent">Rent</option>
        </select>
        <select name="type" className="search-select" value={form.type} onChange={handleChange}>
          <option value="">Property Type</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </select>
        <input
          name="city" placeholder="City"
          className="search-input city-input" value={form.city} onChange={handleChange}
        />
      </div>
      <button type="submit" className="btn btn-gold search-btn">🔍 Search</button>
    </form>
  );
};

export default SearchBar;
