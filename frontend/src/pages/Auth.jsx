import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

const Auth = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-box">
        <div className="auth-logo">
          <span role="img" aria-label="logo">🚀</span>
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