import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../utils/api';
import { toast } from 'react-toastify';
import './PropertyForm.css';

const AMENITIES_OPTIONS = ['Parking', 'Swimming Pool', 'Gym', 'Garden', 'Security', 'Elevator', 'Power Backup', 'Wi-Fi', 'AC', 'Furnished'];

const AddProperty = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState({
    title: '', description: '', type: 'apartment', listingType: 'sale',
    price: '', area: '', bedrooms: '', bathrooms: '',
    street: '', city: '', state: '', zipCode: '',
    amenities: [],
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const toggleAmenity = (a) => {
    setForm(f => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter(x => x !== a) : [...f.amenities, a],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (!['street','city','state','zipCode','amenities'].includes(k)) fd.append(k, v);
      });
      fd.append('address', JSON.stringify({ street: form.street, city: form.city, state: form.state, zipCode: form.zipCode }));
      fd.append('amenities', JSON.stringify(form.amenities));
      images.forEach((img) => fd.append('images', img));
      await createProperty(fd);
      toast.success('Property listed successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="prop-form-page">
      <div className="page-header">
        <div className="container">
          <h1>List a Property</h1>
          <p>Fill in the details to publish your listing</p>
        </div>
      </div>

      <div className="container form-container">
        <form onSubmit={handleSubmit} className="prop-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label>Property Title *</label>
              <input name="title" className="form-control" placeholder="e.g. Spacious 3BHK in Bandra West"
                value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" className="form-control" placeholder="Describe the property..."
                value={form.description} onChange={handleChange} required />
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>Property Type *</label>
                <select name="type" className="form-control" value={form.type} onChange={handleChange}>
                  <option value="apartment">Apartment</option>
                  <option value="house">House</option>
                  <option value="villa">Villa</option>
                  <option value="plot">Plot</option>
                  <option value="commercial">Commercial</option>
                </select>
              </div>
              <div className="form-group">
                <label>Listing Type *</label>
                <select name="listingType" className="form-control" value={form.listingType} onChange={handleChange}>
                  <option value="sale">For Sale</option>
                  <option value="rent">For Rent</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Price & Area</h2>
            <div className="form-row-3">
              <div className="form-group">
                <label>Price (₹) *</label>
                <input type="number" name="price" className="form-control" placeholder="e.g. 5000000"
                  value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Area (sq. ft.) *</label>
                <input type="number" name="area" className="form-control" placeholder="e.g. 1200"
                  value={form.area} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>Bedrooms</label>
                <input type="number" name="bedrooms" className="form-control" placeholder="0" min="0"
                  value={form.bedrooms} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Bathrooms</label>
                <input type="number" name="bathrooms" className="form-control" placeholder="0" min="0"
                  value={form.bathrooms} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Location</h2>
            <div className="form-group">
              <label>Street Address</label>
              <input name="street" className="form-control" placeholder="Street / Area"
                value={form.street} onChange={handleChange} />
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label>City *</label>
                <input name="city" className="form-control" placeholder="Mumbai"
                  value={form.city} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>State *</label>
                <input name="state" className="form-control" placeholder="Maharashtra"
                  value={form.state} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input name="zipCode" className="form-control" placeholder="400001"
                  value={form.zipCode} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Amenities</h2>
            <div className="amenities-grid">
              {AMENITIES_OPTIONS.map((a) => (
                <label key={a} className={`amenity-check ${form.amenities.includes(a) ? 'checked' : ''}`}>
                  <input type="checkbox" checked={form.amenities.includes(a)} onChange={() => toggleAmenity(a)} />
                  {a}
                </label>
              ))}
            </div>
          </div>

          <div className="form-section">
            <h2>Photos</h2>
            <div className="form-group">
              <label>Upload Images (up to 10)</label>
              <input type="file" accept="image/*" multiple className="form-control"
                onChange={(e) => setImages(Array.from(e.target.files))} />
              {images.length > 0 && (
                <div className="img-preview">
                  {images.map((img, i) => (
                    <img key={i} src={URL.createObjectURL(img)} alt="" className="preview-thumb" />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-gold" disabled={loading}>
              {loading ? 'Publishing...' : '🏠 Publish Listing'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
