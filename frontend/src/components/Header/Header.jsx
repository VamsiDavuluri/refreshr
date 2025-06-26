 import React from 'react';
 import { useNavigate, Link } from 'react-router-dom';
 import './Header.css';

const Header = () => {
   const navigate = useNavigate();

   return (
    <header className="navbar-container">
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

      <button onClick={() => navigate(-1)} className="back-button">
        <span>←</span>
       </button>
    </header>
   );
 };

 export default Header;