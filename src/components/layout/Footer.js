import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container footer-inner">
      <div className="footer-brand">
        <div className="footer-logo">🏡 EstateHub</div>
        <p>Find your perfect home. Buy, sell, or rent properties across India with ease.</p>
      </div>
      <div className="footer-links">
        <h4>Quick Links</h4>
        <Link to="/">Home</Link>
        <Link to="/properties">Properties</Link>
        <Link to="/register">List Property</Link>
      </div>
      <div className="footer-links">
        <h4>Account</h4>
        <Link to="/login">Login</Link>
        <Link to="/register">Sign Up</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
      <div className="footer-contact">
        <h4>Contact</h4>
        <p>📧 info@estatehub.in</p>
        <p>📞 +91 98765 43210</p>
        <p>📍 Mumbai, India</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} EstateHub. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;
