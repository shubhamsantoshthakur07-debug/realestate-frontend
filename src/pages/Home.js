import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import PropertyCard from '../components/common/PropertyCard';
import { fetchFeatured } from '../utils/api';
import './Home.css';

const stats = [
  { label: 'Properties Listed', value: '5,200+' },
  { label: 'Happy Clients', value: '12,000+' },
  { label: 'Cities Covered', value: '80+' },
  { label: 'Trusted Agents', value: '900+' },
];

const whys = [
  { icon: '🔍', title: 'Smart Search', desc: 'Filter by price, type, location, and more to find exactly what you need.' },
  { icon: '🛡️', title: 'Verified Listings', desc: 'Every property is verified by our team for accuracy and authenticity.' },
  { icon: '💬', title: 'Direct Contact', desc: 'Connect directly with owners or agents, no middlemen.' },
  { icon: '🏷️', title: 'Best Price', desc: 'Transparent pricing with no hidden fees or commissions.' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeatured()
      .then(({ data }) => setFeatured(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="container hero-content">
          <p className="hero-eyebrow">India's #1 Real Estate Platform</p>
          <h1 className="hero-title">Find Your Dream<br />Home Today</h1>
          <p className="hero-sub">Explore thousands of verified properties for sale and rent across India.</p>
          <SearchBar />
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="container stats-grid">
          {stats.map((s) => (
            <div key={s.label} className="stat-item">
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="section">
        <div className="container">
          <p className="section-eyebrow">Handpicked for you</p>
          <h2 className="section-title">Featured Properties</h2>
          <p className="section-sub">Premium listings selected by our expert team</p>

          {loading ? (
            <div className="spinner-wrap"><div className="spinner" /></div>
          ) : featured.length > 0 ? (
            <div className="properties-grid">
              {featured.map((p) => <PropertyCard key={p._id} property={p} />)}
            </div>
          ) : (
            <div className="empty-state">
              <p>No featured properties yet. <Link to="/add-property">List yours!</Link></p>
            </div>
          )}

          <div className="text-center mt-3">
            <Link to="/properties" className="btn btn-primary">View All Properties →</Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="why-section">
        <div className="container">
          <p className="section-eyebrow">Why EstateHub</p>
          <h2 className="section-title">The Smarter Way to Find Property</h2>
          <p className="section-sub">We make buying, selling, and renting simple</p>
          <div className="why-grid">
            {whys.map((w) => (
              <div key={w.title} className="why-card">
                <div className="why-icon">{w.icon}</div>
                <h3>{w.title}</h3>
                <p>{w.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-inner">
          <h2>Ready to List Your Property?</h2>
          <p>Join thousands of property owners who trust EstateHub to connect them with serious buyers and tenants.</p>
          <div className="cta-btns">
            <Link to="/register" className="btn btn-gold">Get Started Free</Link>
            <Link to="/properties" className="btn btn-outline cta-outline">Browse Listings</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
