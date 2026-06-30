import React from 'react';
import { Link } from 'react-router-dom';
import './PropertyCard.css';

const PropertyCard = ({ property, onDelete, showActions }) => {
  const { _id, title, price, listingType, type, address, images, bedrooms, bathrooms, area } = property;

  const formatPrice = (p) =>
    p >= 10000000
      ? `₹${(p / 10000000).toFixed(1)} Cr`
      : p >= 100000
      ? `₹${(p / 100000).toFixed(1)} L`
      : `₹${p.toLocaleString()}`;

  return (
    <div className="property-card card">
      <Link to={`/properties/${_id}`} className="card-img-wrap">
        <img
          src={images?.[0] || 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600'}
          alt={title}
          className="card-img"
        />
        <span className={`card-badge badge badge-${listingType}`}>
          For {listingType === 'sale' ? 'Sale' : 'Rent'}
        </span>
      </Link>

      <div className="card-body">
        <div className="card-type">{type}</div>
        <h3 className="card-title">
          <Link to={`/properties/${_id}`}>{title}</Link>
        </h3>
        <p className="card-location">📍 {address?.city}, {address?.state}</p>

        <div className="card-meta">
          {bedrooms > 0 && <span>🛏 {bedrooms} Beds</span>}
          {bathrooms > 0 && <span>🚿 {bathrooms} Baths</span>}
          <span>📐 {area} sqft</span>
        </div>

        <div className="card-footer">
          <div className="card-price">{formatPrice(price)}{listingType === 'rent' && '/mo'}</div>
          {showActions && (
            <div className="card-actions">
              <Link to={`/edit-property/${_id}`} className="btn btn-outline btn-sm">Edit</Link>
              <button onClick={() => onDelete(_id)} className="btn btn-danger btn-sm">Delete</button>
            </div>
          )}
          {!showActions && (
            <Link to={`/properties/${_id}`} className="btn btn-primary btn-sm">View</Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
