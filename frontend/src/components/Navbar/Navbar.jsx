import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Navbar.css';

const Navbar = ({ links = [] }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.name || decodedToken.email);
      } catch (error) {
        console.error("Invalid token:", error);
        handleLogout();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="navbar-container">
      <div className="navbar-left">
        <Link to="/home" className="navbar-logo">
          <svg
            className="steps-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M3 17h4v4H3v-4zm0-6h6v4H3v-4zm0-6h8v4H3V5zm10 0h8v2h-8V5zm0 6h6v2h-6v-2zm0 6h4v2h-4v-2z" />
          </svg>
          <span>refreshr</span>
        </Link>
      </div>

      <div className="navbar-center">
        <nav className="navbar-links">
          {links.map((link) => (
            <Link key={link.name} to={link.path}>{link.name}</Link>
          ))}
        </nav>
      </div>

      <div className="navbar-right">
        <div className="navbar-actions" ref={dropdownRef}>
          <button className="navbar-icon-btn">
            <span role="img" aria-label="notifications"></span>
          </button>

          {/* Updated Profile Avatar SVG */}
          <svg
            onClick={() => setDropdownOpen(!isDropdownOpen)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="navbar-avatar"
          >
            <path
              fillRule="evenodd"
              d="M12 2a5 5 0 00-5 5v1a5 5 0 0010 0V7a5 5 0 00-5-5zm0 13c-4.418 0-8 2.239-8 5v1a1 1 0 001 1h14a1 1 0 001-1v-1c0-2.761-3.582-5-8-5z"
              clipRule="evenodd"
            />
          </svg>

          {isDropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-user-info">
                <span>Signed in as</span>
                <strong>{userName}</strong>
              </div>
              <Link to="/my-attempts" className="dropdown-link">
                My Attempts
              </Link>
              <button onClick={handleLogout} className="dropdown-logout-btn">
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;