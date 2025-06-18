import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Navbar.css';

const Navbar = ({ links = [] }) => {
  const navigate = useNavigate();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserEmail(decodedToken.email);
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
          <span role="img" aria-label="logo">🚀</span>
          <span>refreshr</span>
        </Link>
      </div>
      <div className="navbar-center">
        <nav className="navbar-links">
          {/* The "Create Quiz" link has been removed from here */}
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
          <img
            src="https://i.pinimg.com/564x/36/49/09/3649097f0d98ad46c1639ee0ee4d562c.jpg"
            alt="Profile"
            className="navbar-avatar"
            onClick={() => setDropdownOpen(!isDropdownOpen)}
          />
          {isDropdownOpen && (
            <div className="profile-dropdown">
              <div className="dropdown-user-info">
                <span>Signed in as</span>
                <strong>{userEmail}</strong>
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