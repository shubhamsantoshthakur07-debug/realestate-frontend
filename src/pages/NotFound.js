import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => (
  <div style={{textAlign:'center', padding:'8rem 2rem', color:'var(--gray-400)'}}>
    <div style={{fontSize:'5rem', marginBottom:'1rem'}}>🏚️</div>
    <h1 style={{fontFamily:"'Playfair Display',serif", fontSize:'2.5rem', color:'var(--navy)', marginBottom:'0.5rem'}}>404</h1>
    <h2 style={{color:'var(--gray-600)', marginBottom:'0.75rem'}}>Page Not Found</h2>
    <p style={{marginBottom:'2rem'}}>The page you're looking for doesn't exist.</p>
    <Link to="/" className="btn btn-primary">Back to Home</Link>
  </div>
);

export default NotFound;
