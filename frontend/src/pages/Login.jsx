import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios'; // <-- Import axios
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

  // --- UPDATED ONSUBMIT FUNCTION ---
  const onSubmit = async (data) => {
    setLoginError(''); // Clear previous errors
    try {
      // Send a POST request to the backend login endpoint
      const response = await axios.post('http://localhost:3001/api/auth/login', data);
      
      // On successful login, the backend sends a token.
      // We save this token to localStorage to keep the user logged in.
      const { token } = response.data;
      localStorage.setItem('token', token);

      // Navigate to the main homepage after successful login
      navigate("/home");

    } catch (error) {
      // If login fails, display the error message from the backend
      if (error.response && error.response.data) {
        setLoginError(error.response.data.message); // e.g., "Invalid email or password."
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

        {/* Display login error message from the server on the form */}
        {loginError && <p className="error-message server-error">{loginError}</p>}

        <button type="submit" className="btn-submit">Login</button>

        <p className="redirect-link">
          Don't have an an account? <Link to="/register">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;