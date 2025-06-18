import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios'; // <-- Import axios
import './AuthForm.css';

const schema = yup.object().shape({
  email: yup.string().email("Invalid email format").required("Email is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
});

const Register = () => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  // --- UPDATED ONSUBMIT FUNCTION ---
  const onSubmit = async (data) => {
    try {
      // Send a POST request to the backend registration endpoint
      const response = await axios.post('http://localhost:3001/api/register', data);
      
      // Show success message from the server and navigate to login
      alert(response.data.message);
      navigate("/login");

    } catch (error) {
      // If the request fails, show the error message from the backend
      if (error.response && error.response.data) {
        alert(error.response.data.message); // e.g., "User with this email already exists."
      } else {
        alert("An error occurred during registration. Please try again.");
      }
    }
  };

  return (
    <div className="auth-form-container">
      <form className="auth-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2>Create Account</h2>
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

        <button type="submit" className="btn-submit">Register</button>

        <p className="redirect-link">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;