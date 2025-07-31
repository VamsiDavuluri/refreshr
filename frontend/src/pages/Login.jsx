// frontend/src/pages/Login.jsx
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import api from '../api';
import './AuthForm.css';

const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    setLoginError('');
    try {
      const response = await api.post('/api/auth/login', data);

      // --- DEBUGGING AND FIX ---
      console.log("Full response from backend:", response);
      console.log("Response data object:", response.data);

      // 1. Extract the token from the response data object.
      const token = response.data.token;
      
      console.log("Extracted token:", token);

      // 2. Check if the extracted token is a valid string.
      if (token && typeof token === 'string' && token.length > 10) {
        // 3. Save ONLY the token string to local storage.
        localStorage.setItem('token', token);
        console.log("Token saved to local storage. Navigating to home...");
        navigate("/home");
      } else {
        // This will catch if the backend response is malformed.
        console.error("Login failed: Backend did not return a valid token string.");
        setLoginError("Login failed: Invalid response from server.");
      }

    } catch (error) {
      console.error("An error occurred during login:", error);
      if (error.response && error.response.data) {
        setLoginError(error.response.data.message);
      } else {
        setLoginError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2>Login</h2>
        <div className="form-group">
          <label>Email</label>
          <input type="email" {...register("email")} />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" {...register("password")} />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>
        {loginError && <p className="error-message server-error">{loginError}</p>}
        <button type="submit" className="btn-submit">Login</button>
        <p className="redirect-link">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;