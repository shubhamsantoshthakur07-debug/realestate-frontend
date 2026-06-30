import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../components/common/PropertyCard';
import { getFavorites } from '../utils/api';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFavorites()
      .then(({ data }) => setFavorites(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="page-header">
        <div className="container">
          <h1>Saved Properties</h1>
          <p>{favorites.length} saved listing{favorites.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="container section">
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : favorites.length === 0 ? (
          <div style={{textAlign:'center', padding:'5rem 2rem', color:'var(--gray-400)'}}>
            <div style={{fontSize:'3rem', marginBottom:'1rem'}}>🤍</div>
            <h3 style={{color:'var(--gray-600)'}}>No saved properties yet</h3>
            <p style={{marginBottom:'1.5rem'}}>Browse properties and save your favorites</p>
            <Link to="/properties" className="btn btn-primary">Browse Properties</Link>
          </div>
        ) : (
          <div className="properties-grid">
            {favorites.map((p) => <PropertyCard key={p._id} property={p} />)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
