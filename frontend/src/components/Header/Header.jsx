import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="simple-header-container">
      {/* The logo is now a link to the homepage */}
      <Link to="/home" className="simple-header-logo">
        <span role="img" aria-label="logo">🚀</span>
        <span>refreshr</span>
      </Link>
      <button onClick={() => navigate(-1)} className="back-button">
        <span>←</span>
      </button>
    </header>
  );
};

export default Header;