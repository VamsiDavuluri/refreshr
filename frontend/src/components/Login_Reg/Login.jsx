import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    setError("");
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/login`,
        data
      );

      const { token } = response.data;
      localStorage.setItem("token", token);
      alert("Login successful!");
      navigate("/home");
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-group">
          <label>Email</label>
          <input type="email" {...register("email")} />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        <div className="form-group">
          <label>Password</label>
          <input type="password" {...register("password")} />
          {errors.password && <p className="error">{errors.password.message}</p>}
        </div>

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn">Login</button>
      </form>

      <button
        onClick={() => navigate("/results")}
        className="btn"
        style={{ marginTop: "20px", backgroundColor: "#888" }}
      >
        View Quiz Results
      </button>
    </div>
  );
};

export default Login;