import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PropertyCard from '../components/common/PropertyCard';
import { fetchMyProperties, deleteProperty } from '../utils/api';
import { toast } from 'react-toastify';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyProperties()
      .then(({ data }) => setProperties(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this property?')) return;
    try {
      await deleteProperty(id);
      setProperties(properties.filter((p) => p._id !== id));
      toast.success('Property deleted');
    } catch {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <div className="container">
          <h1>My Dashboard</h1>
          <p>Manage your properties and account</p>
        </div>
      </div>

      <div className="container dashboard-content">
        {/* Welcome */}
        <div className="welcome-card">
          <img src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&size=80`} alt="" className="welcome-avatar" />
          <div>
            <h2>Welcome, {user?.name}!</h2>
            <p>{user?.email} · <span className="role-badge">{user?.role}</span></p>
          </div>
          <div className="welcome-actions">
            <Link to="/add-property" className="btn btn-gold">+ List Property</Link>
            <Link to="/profile" className="btn btn-outline">Edit Profile</Link>
          </div>
        </div>

        {/* Stats */}
        <div className="dash-stats">
          <div className="dash-stat"><div className="dash-stat-num">{properties.length}</div><div>My Listings</div></div>
          <div className="dash-stat"><div className="dash-stat-num">{properties.filter(p => p.listingType === 'sale').length}</div><div>For Sale</div></div>
          <div className="dash-stat"><div className="dash-stat-num">{properties.filter(p => p.listingType === 'rent').length}</div><div>For Rent</div></div>
          <div className="dash-stat"><div className="dash-stat-num">{properties.reduce((a, p) => a + (p.views || 0), 0)}</div><div>Total Views</div></div>
        </div>

        {/* Properties */}
        <div className="dash-section">
          <div className="dash-section-header">
            <h2>My Properties</h2>
            <Link to="/add-property" className="btn btn-primary btn-sm">+ Add New</Link>
          </div>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : properties.length === 0 ? (
            <div className="empty-dash">
              <div style={{fontSize:'3rem'}}>🏠</div>
              <h3>No properties yet</h3>
              <p>List your first property to get started</p>
              <Link to="/add-property" className="btn btn-gold">List a Property</Link>
            </div>
          ) : (
            <div className="properties-grid">
              {properties.map((p) => (
                <PropertyCard key={p._id} property={p} showActions onDelete={handleDelete} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
