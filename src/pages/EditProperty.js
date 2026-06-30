import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchProperty, updateProperty } from '../utils/api';
import { toast } from 'react-toastify';
import './PropertyForm.css';

const AMENITIES_OPTIONS = ['Parking', 'Swimming Pool', 'Gym', 'Garden', 'Security', 'Elevator', 'Power Backup', 'Wi-Fi', 'AC', 'Furnished'];

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [images, setImages] = useState([]);
  const [form, setForm] = useState(null);

  useEffect(() => {
    fetchProperty(id).then(({ data }) => {
      setForm({
        title: data.title, description: data.description, type: data.type,
        listingType: data.listingType, price: data.price, area: data.area,
        bedrooms: data.bedrooms, bathrooms: data.bathrooms,
        street: data.address?.street || '', city: data.address?.city || '',
        state: data.address?.state || '', zipCode: data.address?.zipCode || '',
        amenities: data.amenities || [],
      });
    }).catch(() => navigate('/dashboard'))
      .finally(() => setFetching(false));
  }, [id]);

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
      await updateProperty(id, fd);
      toast.success('Property updated!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div className="spinner-wrap"><div className="spinner" /></div>;
  if (!form) return null;

  return (
    <div className="prop-form-page">
      <div className="page-header">
        <div className="container">
          <h1>Edit Property</h1>
          <p>Update your listing details</p>
        </div>
      </div>

      <div className="container form-container">
        <form onSubmit={handleSubmit} className="prop-form">
          <div className="form-section">
            <h2>Basic Information</h2>
            <div className="form-group">
              <label>Property Title *</label>
              <input name="title" className="form-control" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description *</label>
              <textarea name="description" className="form-control" value={form.description} onChange={handleChange} required />
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
            <div className="form-row-2">
              <div className="form-group">
                <label>Price (₹) *</label>
                <input type="number" name="price" className="form-control" value={form.price} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Area (sq. ft.) *</label>
                <input type="number" name="area" className="form-control" value={form.area} onChange={handleChange} required />
              </div>
            </div>
            <div className="form-row-2">
              <div className="form-group">
                <label>Bedrooms</label>
                <input type="number" name="bedrooms" className="form-control" value={form.bedrooms} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Bathrooms</label>
                <input type="number" name="bathrooms" className="form-control" value={form.bathrooms} onChange={handleChange} />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h2>Location</h2>
            <div className="form-group">
              <label>Street</label>
              <input name="street" className="form-control" value={form.street} onChange={handleChange} />
            </div>
            <div className="form-row-3">
              <div className="form-group">
                <label>City *</label>
                <input name="city" className="form-control" value={form.city} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>State *</label>
                <input name="state" className="form-control" value={form.state} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input name="zipCode" className="form-control" value={form.zipCode} onChange={handleChange} />
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
            <h2>Add More Photos</h2>
            <div className="form-group">
              <input type="file" accept="image/*" multiple className="form-control"
                onChange={(e) => setImages(Array.from(e.target.files))} />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate(-1)}>Cancel</button>
            <button type="submit" className="btn btn-gold" disabled={loading}>
              {loading ? 'Saving...' : '💾 Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProperty;
