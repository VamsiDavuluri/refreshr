 import React from 'react';
 import { useNavigate, Link } from 'react-router-dom';
 import './Header.css';

const Header = () => {
   const navigate = useNavigate();

   return (
    <header className="simple-header-container">
      <Link to="/home" className="simple-header-logo">
         <svg
          xmlns="http://www.w3.org/2000/svg"
          width="26"
          height="26"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#f59e0b"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ marginRight: "0.5rem" }}
        >
           <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
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