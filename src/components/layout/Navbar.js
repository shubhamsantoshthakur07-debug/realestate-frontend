import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="nav-logo">
          <span className="logo-icon">🏡</span>
          <span>EstateHub</span>
        </Link>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          <span /><span /><span />
        </button>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <NavLink to="/" end onClick={() => setMenuOpen(false)}>Home</NavLink>
          <NavLink to="/properties" onClick={() => setMenuOpen(false)}>Properties</NavLink>

          {user ? (
            <>
              <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>
              <NavLink to="/favorites" onClick={() => setMenuOpen(false)}>Favorites</NavLink>
              <div className="nav-dropdown">
                <button className="drop-trigger" onClick={() => setDropOpen(!dropOpen)}>
                  <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.name}`} alt="" className="nav-avatar" />
                  {user.name.split(' ')[0]}
                  <span>▾</span>
                </button>
                {dropOpen && (
                  <div className="drop-menu">
                    <Link to="/profile" onClick={() => { setDropOpen(false); setMenuOpen(false); }}>Profile</Link>
                    <Link to="/add-property" onClick={() => { setDropOpen(false); setMenuOpen(false); }}>List Property</Link>
                    <button onClick={handleLogout}>Logout</button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="btn btn-outline btn-sm" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="btn btn-gold btn-sm" onClick={() => setMenuOpen(false)}>Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
