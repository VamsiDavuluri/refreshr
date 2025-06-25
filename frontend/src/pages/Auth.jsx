import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">
         <svg
            
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="auth-icon"
          >
            <path d="M3 17h4v4H3v-4zm0-6h6v4H3v-4zm0-6h8v4H3V5zm10 0h8v2h-8V5zm0 6h6v2h-6v-2zm0 6h4v2h-4v-2z" />
          </svg>
          <h1>refreshr</h1>
        </div>
        <p>Sharpen your knowledge. Log in or create an account to start quizzing.</p>
        <div className="auth-actions">
          <button className="btn-auth primary" onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="btn-auth secondary" onClick={() => navigate('/register')}>
            Create Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;