// frontend/src/pages/Register.jsx

import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import api from '../api';
import './AuthForm.css';

// 1. Add 'name' to the validation schema.
const schema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    try {
      // The 'data' object from the form will now include the 'name'
      const response = await api.post('/api/auth/register', data);
      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      } else {
        alert("An error occurred during registration.");
      }
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2>Create Account</h2>
        
        {/* --- THIS IS THE FIX --- */}
        {/* 2. Add the Name input field to the form's JSX. */}
        <div className="form-group">
          <label>Name</label>
          <input 
            type="text" 
            placeholder="Enter your full name" 
            {...register("name")} 
          />
          {errors.name && <p className="error-message">{errors.name.message}</p>}
        </div>

        <div className="form-group">
          <label>Email</label>
          <input 
            type="email" 
            placeholder="Enter your email" 
            {...register("email")} 
          />
          {errors.email && <p className="error-message">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            {...register("password")} 
          />
          {errors.password && <p className="error-message">{errors.password.message}</p>}
        </div>

        <button type="submit" className="btn-submit">Register</button>
        
        <p className="redirect-link">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;